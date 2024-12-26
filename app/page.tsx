'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Copy, Trash2, ExternalLink } from 'lucide-react';
import { formatDate, formatDateTime, isExpired } from '@/lib/utils';
import { shortenUrl } from '@/lib/shortenUrl';
import { deleteDoc, doc, onSnapshot, collection, query, where } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface ShortenedUrl {
    id: string;
    shortenedUrl: string;
    originalUrl: string;
    slug: string;
    visitCount: number;
    createdAt: string | Date | null;
    expirationDate: string | Date | null;
}

export default function Home() {
    const [urls, setUrls] = useState<ShortenedUrl[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setInitialized(true);
            if (!user) {
                // If not logged in, try to load from localStorage
                const storedUrls = localStorage.getItem('shortenedUrls');
                if (storedUrls) {
                    try {
                        setUrls(JSON.parse(storedUrls));
                    } catch (error) {
                        console.error('Failed to parse stored URLs');
                    }
                }
                return;
            }

            // If logged in, subscribe to Firestore updates
            const q = query(collection(db, 'urls'), where('userId', '==', user.uid));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const updatedUrls = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        shortenedUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${data.slug}`,
                        createdAt: data.createdAt?.toDate() || null,
                        expirationDate: data.expirationDate?.toDate() || null,
                    };
                }) as ShortenedUrl[];
                setUrls(updatedUrls);
                localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
            }, (error) => {
                console.error('Firestore subscription error:', error);
                // Fallback to localStorage if Firestore fails
                const storedUrls = localStorage.getItem('shortenedUrls');
                if (storedUrls) {
                    try {
                        setUrls(JSON.parse(storedUrls));
                    } catch (error) {
                        console.error('Failed to parse stored URLs');
                    }
                }
            });

            return () => unsubscribe();
        });

        // Cleanup auth subscription
        return () => unsubscribeAuth();
    }, []);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const formData = new FormData(event.currentTarget);
        const originalUrl = formData.get('originalUrl') as string;
        const customSlug = formData.get('customSlug') as string;
        const expirationDate = formData.get('expirationDate') as string;

        try {
            const result = await shortenUrl(originalUrl, customSlug, expirationDate);
            // Update local state immediately for better UX
            const updatedUrls = [result, ...urls];
            setUrls(updatedUrls);
            localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
            (event.target as HTMLFormElement).reset();
        } catch (error) {
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async (url: string) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(url);
            setTimeout(() => setCopied(null), 2000);
        } catch (error) {
            setError('Failed to copy to clipboard');
        }
    };

    const handleDelete = async (urlId: string) => {
        try {
            await deleteDoc(doc(db, 'urls', urlId));
            const updatedUrls = urls.filter(url => url.id !== urlId);
            setUrls(updatedUrls);
            localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
        } catch (error) {
            setError('Failed to delete URL');
        }
    };

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Card className="shadow-lg">
                    <CardHeader className="bg-primary text-white">
                        <CardTitle className="text-4xl font-bold">URL Shortener</CardTitle>
                        <CardDescription className="text-gray-100">
                            Shorten, track, and manage your URLs
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
                                    Original URL
                                </label>
                                <Input
                                    type="url"
                                    id="originalUrl"
                                    name="originalUrl"
                                    className="mt-1"
                                    placeholder="https://example.com"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="customSlug" className="block text-sm font-medium text-gray-700">
                                        Custom Slug (optional)
                                    </label>
                                    <Input
                                        type="text"
                                        id="customSlug"
                                        name="customSlug"
                                        className="mt-1"
                                        placeholder="my-custom-url"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700">
                                        Expiration Date (optional)
                                    </label>
                                    <Input
                                        type="date"
                                        id="expirationDate"
                                        name="expirationDate"
                                        className="mt-1"
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Shortening...
                                    </>
                                ) : (
                                    'Shorten URL'
                                )}
                            </Button>
                        </form>

                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {urls.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-xl font-semibold mb-4">Your Shortened URLs</h2>
                                <div className="space-y-4">
                                    {urls.map((url) => (
                                        <Card key={url.id} className="p-4">
                                            <div className="flex flex-col space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-2">
                                                        <a
                                                            href={url.shortenedUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-primary hover:underline font-medium flex items-center"
                                                        >
                                                            {url.shortenedUrl}
                                                            <ExternalLink className="ml-1 h-4 w-4" />
                                                        </a>
                                                    </div>
                                                    <div className="flex space-x-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleCopy(url.shortenedUrl)}
                                                            className="flex items-center space-x-1"
                                                        >
                                                            {copied === url.shortenedUrl ? (
                                                                'Copied!'
                                                            ) : (
                                                                <>
                                                                    <Copy className="h-4 w-4" />
                                                                    <span className="sr-only">Copy URL</span>
                                                                </>
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => handleDelete(url.id)}
                                                            className="flex items-center space-x-1"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="sr-only">Delete URL</span>
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Original: {url.originalUrl}
                                                </div>
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <span>Created: {formatDateTime(url.createdAt)}</span>
                                                    <span>Visits: {url.visitCount || 0}</span>
                                                    {url.expirationDate && (
                                                        <span className={isExpired(url.expirationDate) ? 'text-red-500' : ''}>
                                                            Expires: {formatDate(url.expirationDate)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}