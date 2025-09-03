"use client";

import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ChatPage() {
	const { logout } = useAuth();
	const [messages, setMessages] = useState<unknown[] | null>(null);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let mounted = true;
		authApi
			.getMessages()
			.then((data) => {
				if (!mounted) return;
				// backend response shape unknown; try to accept common forms
				const list = data?.messages || data || [];
				setMessages(Array.isArray(list) ? list : []);
			})
			.catch((e) => {
				setError(e.message || "Failed to load messages");
			});
		return () => {
			mounted = false;
		};
	}, []);

	return (
		<AuthGuard>
			<div className="max-w-2xl mx-auto w-full py-8 space-y-4">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-semibold">Chat</h1>
					<button onClick={logout} className="text-sm underline">Logout</button>
				</div>
				{error && <p className="text-red-600 text-sm">{error}</p>}
				<div className="border rounded p-4 min-h-40">
					<pre className="text-sm whitespace-pre-wrap">{JSON.stringify(messages, null, 2)}</pre>
				</div>
			</div>
		</AuthGuard>
	);
}


