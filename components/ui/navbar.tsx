'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from './navigation-menu';

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
        <nav className="bg-indigo-600 p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-white text-2xl font-bold hover:text-gray-200 transition-colors">URL Shortener</Link>
                <div>
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-white mr-4">Welcome, {user.displayName || user.email}</span>
                            <Link href="/dashboard" className="text-white hover:text-gray-200 transition-colors">Dashboard</Link>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuTrigger className="text-white hover:text-gray-200 transition-colors">Menu</NavigationMenuTrigger>
                                        <NavigationMenuContent className="bg-white shadow-md rounded-md p-2">
                                            <NavigationMenuLink asChild>
                                                <Link href="/profile" className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md">Profile</Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link href="/settings" className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md">Settings</Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-black hover:bg-gray-100 rounded-md">Logout</button>
                                            </NavigationMenuLink>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link href="/login" className="text-white hover:text-gray-200 transition-colors">Login</Link>
                            <Link href="/signup" className="text-white hover:text-gray-200 transition-colors">Sign Up</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}