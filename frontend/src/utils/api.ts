import { getIdToken } from "firebase/auth";
import { auth } from "@/firebase/config";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050";

export async function fetchApi(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;
  return fetch(url, options);
}

export async function fetchApiAuthenticated(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await getIdToken(user);

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  return fetchApi(endpoint, { ...options, headers });
}
