'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Home() {
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const originalUrl = formData.get('originalUrl') as string;
        const customSlug = formData.get('customSlug') as string;

        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl, customSlug }),
        });

        const result = await response.json();
        if (response.ok) {
            setShortenedUrl(result.shortenedUrl);
        } else {
            // Handle error
            console.error(result.error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="bg-indigo-600 text-white">
                    <CardTitle className="text-4xl font-bold">URL Shortener</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <CardDescription className="mb-4 text-gray-700">
                        Easily shorten your URLs and track their usage.
                    </CardDescription>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
                                Original URL
                            </label>
                            <Input
                                type="url"
                                id="originalUrl"
                                name="originalUrl"
                                className="mt-1 block w-full"
                                placeholder="Enter the original URL"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700">
                                Custom Slug (optional)
                            </label>
                            <Input
                                type="text"
                                id="customSlug"
                                name="customSlug"
                                className="mt-1 block w-full"
                                placeholder="Enter a custom slug"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md"
                        >
                            Shorten URL
                        </Button>
                    </form>
                    {shortenedUrl && (
                        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md">
                            <p>Shortened URL: <a href={shortenedUrl} className="text-blue-600 underline">{shortenedUrl}</a></p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}