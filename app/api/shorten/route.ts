import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, getDocs, query, where, doc, updateDoc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db } from '@/lib/firebase';

export async function POST(req: NextRequest) {
    const { originalUrl, customSlug } = await req.json();
    let slug = customSlug || nanoid(6);

    // Check if the slug already exists
    const q = query(collection(db, 'urls'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return NextResponse.json({ error: 'Slug already in use!' }, { status: 400 });
    }

    // Create new shortened URL
    await addDoc(collection(db, 'urls'), {
        originalUrl,
        slug,
        visitCount: 0,
        createdAt: new Date(),
    });

    // Construct the full shortened URL using the base URL
    const shortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`;

    return NextResponse.json({ shortenedUrl });
}
