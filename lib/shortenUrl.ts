import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { db, auth } from '@/lib/firebase';

export async function shortenUrl(originalUrl: string, customSlug?: string, expirationDate?: string) {
    const user = auth.currentUser;

    let slug = customSlug || nanoid(6);

    // Check if the slug already exists
    const q = query(collection(db, 'urls'), where('slug', '==', slug));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        throw new Error('Slug already in use!');
    }

    // Create new shortened URL
    await addDoc(collection(db, 'urls'), {
        originalUrl,
        slug,
        visitCount: 0,
        createdAt: new Date(),
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        userId: user?.uid??null,
    });

    // Construct the full shortened URL using the base URL
    const shortenedUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug}`;

    return shortenedUrl;
}