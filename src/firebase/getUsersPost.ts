import {getFirestore, doc, getDoc, where, collection, getDocs, orderBy} from "firebase/firestore";
import firebase_app from "@/firebase/config";
import {query} from "@firebase/database";

const db = getFirestore(firebase_app)

export default async function getUsersPost(id: string) {
    // @ts-ignore
    const q = query(collection(db, "Posts"), where("authorId", "==", id), orderBy("dateCreated", "desc"));
    let postIds: Array<string> = [];
    // @ts-ignore
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        postIds.push(doc.id)
    });

    return postIds;
}