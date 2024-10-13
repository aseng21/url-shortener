'use client';

import { useState } from 'react';
import axios from 'axios';

export default function ShortenForm() {
    const [url, setUrl] = useState('');
    const [customSlug, setCustomSlug] = useState('');
    const [shortenedUrl, setShortenedUrl] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/shorten', {
                originalUrl: url,
                customSlug,
            });
            setShortenedUrl(response.data.shortenedUrl);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
            <input
                type="text"
                placeholder="Enter your URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="border px-4 py-2"
            />
            <input
                type="text"
                placeholder="Custom slug (optional)"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                className="border px-4 py-2"
            />
            <button type="submit" className="bg-blue-500 text-white px-4 py-2">
                Shorten
            </button>

            {shortenedUrl && (
                <p className="mt-4">Shortened URL: <a href={shortenedUrl}>{shortenedUrl}</a></p>
            )}
        </form>
    );
}
