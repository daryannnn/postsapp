import React, {useEffect} from "react";
import Post from "@/components/Post";
import {Box, Grid, MenuItem, MenuList, ThemeProvider} from "@mui/material";
import getFollowedPosts from "@/firebase/getFollowedPosts";
import {User} from "@firebase/auth";
import Link from "next/link";
import {theme} from "@/utils/theme";

interface Props {
    id: string,
}

export default function UserFeed(props: Props) {
    let postIds: string[] = [];
    // @ts-ignore
    const posts = [];

    const [p, setP] = React.useState(null);

    useEffect(() => {
        async function getPosts() {
            postIds = await getFollowedPosts(props.id);
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
        <ThemeProvider theme={theme}>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Grid container spacing={1} sx={{alignItems: "center", justifyContent: "center", margin: "10px auto"}}>
                {p}
            </Grid>

            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{width: "15vw", margin: "30px"}}>
                    <MenuItem selected>Новости</MenuItem>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/events"}>
                        <MenuItem>Мероприятия</MenuItem>
                    </Link>
                </MenuList>
            </Box>
        </Box>
        </ThemeProvider>
    );
}