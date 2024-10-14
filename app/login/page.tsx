'use client';
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { auth } from '@/lib/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="bg-indigo-600 text-white">
                    <CardTitle className="text-4xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <CardDescription className="mb-4 text-gray-700">
                        Log in to your account
                    </CardDescription>
                    <form className="space-y-4" onSubmit={handleLogin}>
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
                            Log In
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}