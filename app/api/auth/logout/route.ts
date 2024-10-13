// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signOut } from 'firebase/auth';

export async function POST(req: NextRequest) {
    const auth = getAuth();

    try {
        await signOut(auth);
        return NextResponse.json({ message: 'Logged out successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
