// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export async function POST(req: NextRequest) {
    const auth = getAuth();
    const { email, password } = await req.json();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // You can also add session management logic here if needed
        return NextResponse.json({ user });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
