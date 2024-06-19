import getUsersPost from "@/firebase/getUsersPost";
import React, {useEffect} from "react";
import Post from "@/components/Post";
import {Grid} from "@mui/material";
import getFavoritePosts from "@/firebase/getFavoritePosts";

interface Props {
    id: string,
}

export default function FavoritePosts(props: Props) {
    let postIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            postIds = await getFavoritePosts(props.id);
            postIds.map((postId: string) => {
                posts.push(
                    <Grid item>
                        <Post id={postId} currentUserId={props.id}/>
                    </Grid>
                );
                // @ts-ignore
                setP(posts);
            })}
        getPosts();
    }, [])

    return (
        <Grid container spacing={1} sx={{alignItems: "center", justifyContent: "center"}}>
            {p}
        </Grid>
    );
}