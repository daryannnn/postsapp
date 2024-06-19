import UserPosts from "@/components/UserPosts";
import {getAuth, onAuthStateChanged, signInWithEmailAndPassword} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import Post from "@/components/Post";
import FavoritePosts from "@/components/FavoritePosts";
import UserFeed from "@/components/UserFeed";
import React, {useCallback, useEffect} from "react";

const auth = getAuth(firebase_app);
export default function Home() {
    signInWithEmailAndPassword(auth, "gym@gym.yr", "111111");

    const [user, setUser] = React.useState(auth.currentUser);

    const isUserLoggedIn = useCallback(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user)
            }
            console.log(user)
        });
    }, []);

    useEffect(() => {
        isUserLoggedIn();
    }, [isUserLoggedIn]);
    //<Post id={"uXz6OmV1AoncePu2Oz3U"}/>
    //<FavoritePosts id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"}/>
    //<UserPosts id={"u7bg33K1sJT7vTjzrlSi3SKQbcA3"}/>
    //<UserFeed id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"}/>

    if (user != null) {
        return (
            <>
                {
                    //<UserFeed id={"uwQpIREuHGY1b2Mu4EjXfEDw6eW2"} currentUser={user}/>
                }
            </>
        )
    } else {
        return (
            <div></div>
        )
    }
}
