export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function getAuthHeader(): Record<string, string> {
	if (typeof window === "undefined") return {};
	try {
		const token = window.localStorage.getItem("token");
		return token ? { Authorization: `Bearer ${token}` } : {};
	} catch {
		return {};
	}
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const headers: HeadersInit = {
		"Content-Type": "application/json",
		...getAuthHeader(),
		...(options.headers || {}),
	};

	const res = await fetch(`${BASE_URL}${path}`, {
		...options,
		headers,
		credentials: "omit",
	});

	if (res.status === 401) {
		if (typeof window !== "undefined") {
			window.localStorage.removeItem("token");
		}
		throw new Error("Unauthorized");
	}

	if (!res.ok) {
		const text = await res.text();
		throw new Error(text || `Request failed with ${res.status}`);
	}

	const contentType = res.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		return (await res.json()) as T;
	}
	return (await res.text()) as T;
}

export const authApi = {
	login: (data: { username: string; password: string }) =>
		apiFetch<{ token: string }>("/api/auth/login", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	signup: (data: { username: string; password: string }) =>
		apiFetch<{ message: string }>("/api/auth/signup", {
			method: "POST",
			body: JSON.stringify(data),
		}),
	getMessages: () => apiFetch<{ messages: unknown[] }>("/api/chat/messages"),
};


