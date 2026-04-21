
import { StatusCodes } from "http-status-codes";

export async function apiFetch<T>(url: string, options?: RequestInit, router?: any): Promise<T> {
    const res = await fetch(url, { credentials: 'include', ...options });
    if (res.status === StatusCodes.UNAUTHORIZED && router) {
        router.push("/login");
        throw res;
    }
    else if (!res.ok) {
        let message = `HTTP ${res.status}`
        try {
            const data = await res.json()
            message = data.message || data.error || message
        } catch { }

        throw new Error(message);
    }

    if (res.headers.get("Content-Type")?.includes("application/json")) {
        const data = res.json();
        return data;
    }
    return res.text() as unknown as T;
}