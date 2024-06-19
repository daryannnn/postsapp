import getUsersPost from "@/firebase/getUsersPost";
import React, {useEffect} from "react";
import Post from "@/components/Post";
import {Grid, ThemeProvider} from "@mui/material";
import {theme} from "@/utils/theme";

interface Props {
    id: string,
    currentUserId: string,
}

export default function UserPosts(props: Props) {
    let postIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            postIds = await getUsersPost(props.id);
            postIds.map((postId: string) => {
                posts.push(
                    <Grid item>
                        <Post id={postId} currentUserId={props.currentUserId}/>
                    </Grid>
                );
                // @ts-ignore
                setP(posts);
            })}
        getPosts();
    }, [props])

    return (
        <ThemeProvider theme={theme}>
        <Grid container spacing={1} sx={{alignItems: "center", justifyContent: "center"}}>
            {p}
        </Grid>
        </ThemeProvider>
    );
}