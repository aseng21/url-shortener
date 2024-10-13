// app/logout/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        const logout = async () => {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/login');
        };
        logout();
    }, [router]);

    return <p>Logging out...</p>;
}
