import { NextRequest, NextResponse } from 'next/server';
import { getDocs, collection, query, where, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Assuming your firebase config is in this path

export async function GET(req: NextRequest) {
    const slug = req.nextUrl.pathname.split('/').pop(); // Or, if it's in the URL path, retrieve it like this

    if (!slug) {
        return NextResponse.json({ error: 'Slug not provided' }, { status: 400 });
    }

    const q = query(collection(db, 'urls'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const urlData = doc.data();

        // Update visit count
        await updateDoc(doc.ref, {
            visitCount: increment(1),
            lastVisited: new Date(),
        });

        // Redirect to the original URL
        return NextResponse.redirect(urlData.originalUrl);
    }

    return NextResponse.json({ error: 'URL not found' }, { status: 404 });
}
