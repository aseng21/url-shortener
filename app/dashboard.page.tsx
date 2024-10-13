// app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const res = await fetch('/api/auth/user'); // Fetch user session
            const data = await res.json();

            if (res.ok) {
                setUser(data.user); // Set user if authenticated
            } else {
                router.push('/login'); // Redirect to login if not authenticated
            }
        };
        checkUser();
    }, [router]);

    if (!user) {
        return <p>Loading...</p>; // Show loading while checking user
    }

    return (
        <div>
            <h1>Welcome to your Dashboard</h1>
            <p>Manage your shortened URLs here.</p>
        </div>
    );
}
