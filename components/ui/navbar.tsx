'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });
        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
    };

    return (
        <nav className="bg-indigo-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-2xl font-bold">URL Shortener</Link>
                <div>
                    {user ? (
                        <>
                            <span className="text-white mr-4">{user.email}</span>
                            <button onClick={handleLogout} className="text-white">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-white mr-4">Login</Link>
                            <Link href="/signup" className="text-white">Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}