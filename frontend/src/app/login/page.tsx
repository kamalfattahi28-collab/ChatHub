"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";

export default function LoginPage() {
	const { login, isAuthenticated } = useAuth();
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			await login(username, password);
			router.replace("/chat");
		} catch (err: unknown) {
			// @ts-expect-error allow non-json callers to handle
			setError(err?.message || "Login failed");
		} finally {
			setLoading(false);
		}
	}

	// Redirect if already authenticated
	useEffect(() => {
		if (isAuthenticated) {
			router.replace("/chat");
		}
	}, [isAuthenticated, router]);

	if (isAuthenticated) {
		return null;
	}

	return (
		<div className="max-w-sm mx-auto w-full py-12">
			<h1 className="text-2xl font-semibold mb-6">Login</h1>
			<form onSubmit={onSubmit} className="space-y-4">
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="Username"
					className="w-full border rounded px-3 py-2"
					required
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="Password"
					className="w-full border rounded px-3 py-2"
					required
				/>
				<button
					disabled={loading}
					type="submit"
					className="w-full bg-black text-white rounded py-2"
				>
					{loading ? "Logging in..." : "Login"}
				</button>
				{error && <p className="text-red-600 text-sm">{error}</p>}
			</form>
			<p className="mt-4 text-sm">
				Don&apos;t have an account? <Link className="underline" href="/register">Register</Link>
			</p>
		</div>
	);
}


