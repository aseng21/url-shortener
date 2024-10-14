'use client';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import DataTable from '@/components/ui/dataTable';

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
            <DataTable data={urls.map(url => ({
                slug: url.slug,
                originalUrl: url.originalUrl,
                visitCount: url.visitCount.toString(),
                createdAt: new Date(url.createdAt.seconds * 1000).toLocaleString(),
                expirationDate: url.expirationDate ? new Date(url.expirationDate.seconds * 1000).toLocaleString() : 'N/A'
            }))} />
        </div>
    );
}