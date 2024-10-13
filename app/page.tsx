'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import "@fortawesome/fontawesome-free/css/all.css";

export default function Home() {
    const [shortenedUrl, setShortenedUrl] = useState<string | null>(null);
    const [shortenedUrls, setShortenedUrls] = useState<string[]>([]);

    useEffect(() => {
        // Fetch the list of shortened URLs from localStorage when the component mounts
        const storedUrls = localStorage.getItem('shortenedUrls');
        if (storedUrls) {
            setShortenedUrls(JSON.parse(storedUrls));
        }
    }, []);

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
            const updatedUrls = [...shortenedUrls, result.shortenedUrl];
            setShortenedUrls(updatedUrls);
            localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
        } else {
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
                    {shortenedUrls.length > 0 && (
                        <div className="mt-4">
                            <h2 className="text-lg font-medium text-gray-700">Your Shortened URLs:</h2>
                            <ul className="list-none space-y-2">
                                {shortenedUrls.map((url, index) => (
                                    <li key={index} className="flex items-center">
                                        <i className="fas fa-link text-indigo-600 mr-2"></i>
                                        <a href={url} className="text-blue-600 underline">{url}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}