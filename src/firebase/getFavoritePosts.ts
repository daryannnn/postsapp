import {collection, getDocs, getFirestore} from "firebase/firestore";
import firebase_app from "@/firebase/config";

const db = getFirestore(firebase_app)

export default async function getFavoritePosts(id: string) {
    let postIds: Array<string> = [];
    const docRef = collection(db, "Users", id, "User PostIds Favs");
    const docSnap = await getDocs(docRef);
    docSnap.forEach((doc) => {
        postIds.push(doc.get("postId"))
    });

    return postIds;
}