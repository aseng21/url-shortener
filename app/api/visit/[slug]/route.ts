import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = params;

    // Find the URL document by slug
    const q = query(collection(db, 'urls'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return NextResponse.json({ error: 'URL not found!' }, { status: 404 });
    }

    const urlDoc = querySnapshot.docs[0];
    const urlData = urlDoc.data();

    // Increment visit count
    await updateDoc(doc(db, 'urls', urlDoc.id), {
        visitCount: urlData.visitCount + 1,
    });

    return NextResponse.redirect(urlData.originalUrl);
}