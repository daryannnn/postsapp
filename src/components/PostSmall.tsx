import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Box, Button} from "@mui/material";
import {getAuth} from "@firebase/auth";
import firebase_app from "@/firebase/config";
import {useEffect} from "react";
import getPostData from "@/firebase/getPostData";

interface Props {
    id: string,
}

const auth = getAuth(firebase_app);

export default function PostSmall(props: Props) {
    const currentUser = auth.currentUser;

    const [liked, setLiked] = React.useState(false);
    function handleLiked() {
        setLiked(!liked);
    }

    const [favorite, setFavorite] = React.useState(false);
    function handleFavorite() {
        setFavorite(!favorite);
    }

    const [authorName, setName] = React.useState(null);
    const [authorId, setId] = React.useState(null);
    const [dateCreated, setDate] = React.useState(null);
    const [likesCount, setLikesCount] = React.useState(null);
    const [text, setText] = React.useState(null);
    useEffect(() => {
        async function getPost() {
            const post = await getPostData(props.id);
            // @ts-ignore
            setName(post.result.authorName);
            // @ts-ignore
            setId(post.result.authorId);
            // @ts-ignore
            //setDate(post.result.dateCreated);
            // @ts-ignore
            setLikesCount(post.result.likesCount);
            // @ts-ignore
            setText(post.result.text);
        }
        getPost();
    }, [])

    const [own, setOwn] = React.useState(false);
    useEffect(() => {
        (authorId == currentUser?.uid) ? setOwn(true) : setOwn(false)
    }, [currentUser]);

    return (
        <Card sx={{ maxWidth: 300, margin: "0 auto" }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: blue[500] }} variant="rounded">
                        <AccountBoxIcon />
                    </Avatar>
                }
                title={
                    <Typography color={"primary"}>{authorName}</Typography>
                }
                subheader={dateCreated}
            />
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    {text}
                </Typography>
            </CardContent>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
            >
                <CardMedia
                    component="img"
                    height="200"
                    sx={{ minWidth:300, maxWidth: 500}}
                    image="https://images.twinkl.co.uk/tw1n/image/private/t_630_eco/website/uploaded/football-6-1674483025.jpg"
                    alt="football image"
                />
            </Box>
            <CardActions >
                <div>
                    {
                        liked ? (
                            <div>
                                <IconButton onClick={handleLiked} aria-label="like" sx={{ color: "red" }}>
                                    <FavoriteIcon />
                                </IconButton>
                                {likesCount}
                            </div>
                        ) : (
                            <div>
                                <IconButton onClick={handleLiked} aria-label="like">
                                    <FavoriteIcon />
                                </IconButton>
                                {likesCount}
                            </div>
                        )
                    }
                </div>
                <Box sx={{ flexGrow: 1 }} />
                <div>
                    {
                        favorite ? (
                            <IconButton onClick={handleFavorite} aria-label="like" sx={{ color: "yellow" }}>
                                <StarIcon />
                            </IconButton>
                        ) : (
                            <IconButton onClick={handleFavorite} aria-label="like">
                                <StarIcon />
                            </IconButton>
                        )
                    }
                </div>
            </CardActions>
        </Card>
    );
}