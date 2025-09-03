"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/lib/api";

type AuthContextValue = {
	isAuthenticated: boolean;
	token: string | null;
	login: (username: string, password: string) => Promise<void>;
	register: (username: string, password: string) => Promise<void>;
	logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [token, setToken] = useState<string | null>(null);
	const [initialized, setInitialized] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		const existing = window.localStorage.getItem("token");
		if (existing) {
			setToken(existing);
		}
		setInitialized(true);
	}, []);

	const login = useCallback(async (username: string, password: string) => {
		const res = await authApi.login({ username, password });
		window.localStorage.setItem("token", res.token);
		setToken(res.token);
	}, []);

	const register = useCallback(async (username: string, password: string) => {
		await authApi.signup({ username, password });
		// optional: auto login after register
		await login(username, password);
	}, [login]);

	const logout = useCallback(() => {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem("token");
		}
		setToken(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({ isAuthenticated: !!token, token, login, register, logout }),
		[token, login, register, logout]
	);

	if (!initialized) return null;

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}


