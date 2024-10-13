import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { redirect } from 'next/navigation';
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface Props {
    params: { slug: string };
}

export default async function SlugRedirect({ params }: Props) {
    const q = query(collection(db, 'urls'), where('slug', '==', params.slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>URL Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>The URL you are looking for does not exist.</p>
                </CardContent>
            </Card>
        );
    }

    const urlDoc = querySnapshot.docs[0];
    const urlData = urlDoc.data();

    // Increment visit count
    const docRef = doc(db, 'urls', urlDoc.id);
    await updateDoc(docRef, {
        visitCount: urlData.visitCount + 1,
    });

    redirect(urlData.originalUrl);
}