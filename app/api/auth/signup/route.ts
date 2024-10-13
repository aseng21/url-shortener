// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export async function POST(req: NextRequest) {
    const auth = getAuth();
    const { email, password } = await req.json();

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        return NextResponse.json({ user });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}
