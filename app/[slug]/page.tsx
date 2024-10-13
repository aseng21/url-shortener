import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { redirect } from 'next/navigation';

interface Props {
    params: { slug: string };
}

export default async function SlugRedirect({ params }: Props) {
    const q = query(collection(db, 'urls'), where('slug', '==', params.slug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return <h1>URL Not Found</h1>;
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
