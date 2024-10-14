'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

interface UrlData {
    slug: string;
    originalUrl: string;
    visitCount: number;
    createdAt: { seconds: number; nanoseconds: number };
    expirationDate?: { seconds: number; nanoseconds: number };
}

export default function Dashboard() {
    const [urls, setUrls] = useState<UrlData[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const auth = getAuth();

    useEffect(() => {
        const fetchUrls = async (userId: string) => {
            const q = query(collection(db, 'urls'), where('userId', '==', userId));
            const querySnapshot = await getDocs(q);
            const urlsData = querySnapshot.docs.map(doc => doc.data() as UrlData);
            setUrls(urlsData);
            setLoading(false);
        };

        onAuthStateChanged(auth, (user) => {
            if (user) {
                fetchUrls(user.uid);
            } else {
                router.push('/login');
            }
        });
    }, [auth, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="py-2">Slug</th>
                    <th className="py-2">Original URL</th>
                    <th className="py-2">Visit Count</th>
                    <th className="py-2">Created At</th>
                    <th className="py-2">Expiration Date</th>
                </tr>
                </thead>
                <tbody>
                {urls.map((url, index) => (
                    <tr key={index}>
                        <td className="py-2">{url.slug}</td>
                        <td className="py-2">{url.originalUrl}</td>
                        <td className="py-2">{url.visitCount}</td>
                        <td className="py-2">{new Date(url.createdAt.seconds * 1000).toLocaleString()}</td>
                        <td className="py-2">{url.expirationDate ? new Date(url.expirationDate.seconds * 1000).toLocaleString() : 'N/A'}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}