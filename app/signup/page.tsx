'use client';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth, googleProvider } from '@/lib/firebase';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err) {
            setError('Failed to sign up. Please try again.');
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="bg-indigo-600 text-white">
                    <CardTitle className="text-4xl font-bold">Sign Up</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <CardDescription className="mb-4 text-gray-700">
                        Create a new account
                    </CardDescription>
                    <form className="space-y-4" onSubmit={handleSignup}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                className="mt-1 block w-full"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                className="mt-1 block w-full"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md"
                        >
                            Sign Up
                        </Button>
                    </form>
                    <Button
                        onClick={handleGoogleSignIn}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-md mt-4"
                    >
                        Sign up with Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}