'use client';

import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <nav className="bg-gray-900 border-b-2 border-yellow-400 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <span className="text-gray-400">Loading...</span>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-900 border-b-2 border-yellow-400 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Title */}
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <span className="text-2xl">🔒</span>
          <span className="text-xl font-bold text-yellow-400">
            OPERATION: THETA
          </span>
        </Link>

        {/* Conditional Nav Links */}
        <div className="flex items-center gap-6">
          {!user ? (
            // NOT LOGGED IN - Show Login/Register
            <>
              <Link 
                href="/"
                className="text-gray-300 hover:text-yellow-400 transition font-medium"
              >
                Login
              </Link>
              <Link 
                href="/"
                className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold hover:bg-yellow-500 transition"
              >
                Register
              </Link>
            </>
          ) : (
            // LOGGED IN - Show Dashboard, Missions, Leaderboard, Profile
            <>
              <Link 
                href="/dashboard"
                className="text-gray-300 hover:text-yellow-400 transition font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/missions"
                className="text-gray-300 hover:text-yellow-400 transition font-medium"
              >
                Missions
              </Link>
              <Link 
                href="/leaderboard"
                className="text-gray-300 hover:text-yellow-400 transition font-medium"
              >
                Leaderboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold">
                    {user.email?.[0].toUpperCase() || 'U'}
                  </div>
                  <span className="text-white font-medium">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                  <svg 
                    className={`w-4 h-4 text-gray-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-yellow-400 transition"
                      onClick={() => setShowDropdown(false)}
                    >
                      👤 My Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}