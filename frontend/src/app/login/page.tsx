"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/config";
import { signInWithGoogle } from "@/firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function handleGoogleSignIn() {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-200 dark:from-black dark:to-zinc-900">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-zinc-300 dark:border-zinc-700">
        <h1 className="text-4xl font-bold mb-4 text-black dark:text-white">
          Operation Θ
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Welcome, Agent. Sign in to access your missions.
        </p>
        <button
          onClick={handleGoogleSignIn}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition shadow-lg"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
