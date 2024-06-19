import * as React from 'react';
import {useEffect} from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import {blue} from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import {Box, Button, Dialog, DialogContent, Grid} from "@mui/material";
import getPostData from "@/firebase/getPostData";
import firebase_app from "@/firebase/config";
import {getAuth, User} from "@firebase/auth";
import {deleteDoc, onSnapshot, setDoc, updateDoc} from "@firebase/firestore";
import {collection, doc, getFirestore, increment, query, where} from "firebase/firestore";
import Link from "next/link";
import CardMedia from "@mui/material/CardMedia";
import {getDownloadURL, getStorage, ref, StorageReference} from "@firebase/storage";

interface Props {
    id: string,
    currentUserId: string,
}

const auth = getAuth(firebase_app);

export default function Post(props: Props) {
    //const currentUser = auth.currentUser;

    const [authorName, setName] = React.useState(null);
    const [authorId, setId] = React.useState(null);
    const [dateCreated, setDate] = React.useState(null);
    const [likesCount, setLikesCount] = React.useState(null);
    const [text, setText] = React.useState(null);
    const [organizerProfilePhotoUrl, setOrganizerProfilePhotoUrl] = React.useState("");
    const [generalPhotoUrlsArr, setGeneralPhotoUrlsArr] = React.useState<string[]>([]);
    useEffect(() => {
        async function getPost() {
            const post = await getPostData(props.id);
            // @ts-ignore
            setName(post.result.authorName);
            // @ts-ignore
            setId(post.result.authorId);
            // @ts-ignore
            setDate(post.result.dateCreated.toDate().toLocaleDateString());
            // @ts-ignore
            setLikesCount(post.result.likesCount);
            // @ts-ignore
            setText(post.result.text);
            // @ts-ignore
            setOrganizerProfilePhotoUrl(post.result.authorProfilePhotoUrl);
            // @ts-ignore
            setGeneralPhotoUrlsArr(post.result.imagesUrls);
        }
        getPost();
    }, [])

    /*const [own, setOwn] = React.useState(false);
    useEffect(() => {
        (authorId == currentUser?.uid) ? setOwn(true) : setOwn(false)
    }, [currentUser]);*/
    const [own, setOwn] = React.useState(authorId == props.currentUserId);
    useEffect(() => {
        (authorId == props.currentUserId) ? setOwn(true) : setOwn(false)
    }, [authorId])

    const [liked, setLiked] = React.useState(false);
    function handleLiked() {
        updateDoc(doc(getFirestore(firebase_app), "Posts", props.id), {
            likesCount: increment(1),
        });
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Posts", props.id, "Post UserIds Liked", props.currentUserId), {
            userId: props.currentUserId,
        });
        // @ts-ignore
        setLikesCount(likesCount+1)
    }
    function handleDisliked() {
        updateDoc(doc(getFirestore(firebase_app), "Posts", props.id), {
            likesCount: increment(-1),
        });
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Posts", props.id, "Post UserIds Liked", props.currentUserId));
        // @ts-ignore
        setLikesCount(likesCount-1)
    }
    const qLikes = query(collection(getFirestore(firebase_app), "Posts", props.id, "Post UserIds Liked"), where("userId", "==", props.currentUserId));
    const isLiked = onSnapshot(qLikes, (querySnapshot) => {
        setLiked(!querySnapshot.empty);
    });

    const [favorite, setFavorite] = React.useState(false);
    function handleFavorite() {
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Posts", props.id, "Post UserIds Favs", props.currentUserId), {
            userId: props.currentUserId,
        });
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "User PostIds Favs", props.id), {
            postId: props.id,
        });
    }
    function handleUnfavorite() {
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Posts", props.id, "Post UserIds Favs", props.currentUserId));
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "User PostIds Favs", props.id));
    }
    const qFavs = query(collection(getFirestore(firebase_app), "Posts", props.id, "Post UserIds Favs"), where("userId", "==", props.currentUserId));
    const isFavs = onSnapshot(qFavs, (querySnapshot) => {
        setFavorite(!querySnapshot.empty);
    });

    const [followed, setFollowed] = React.useState(false);
    function handleFollowed() {
        // @ts-ignore
        updateDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId), {
            followingsCount: increment(1),
        });
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "Followings Ids", authorId), {
            userId: authorId,
        });
        updateDoc(doc(getFirestore(firebase_app), "Users", authorId!), {
            followersCount: increment(1),
        });
        // @ts-ignore
        setDoc(doc(getFirestore(firebase_app), "Users", authorId!, "Followers Ids", props.currentUserId), {
            userId: props.currentUserId,
        });
    }
    function handleUnfollowed() {
        // @ts-ignore
        updateDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId), {
            followingsCount: increment(-1),
        });
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Users", props.currentUserId, "Followings Ids", authorId));
        updateDoc(doc(getFirestore(firebase_app), "Users", authorId!), {
            followersCount: increment(-1),
        });
        // @ts-ignore
        deleteDoc(doc(getFirestore(firebase_app), "Users", authorId!, "Followers Ids", props.currentUserId));
    }
    // @ts-ignore
    const qFollowed = query(collection(getFirestore(firebase_app), "Users", props.currentUserId, "Followings Ids"), where("userId", "==", authorId));
    const isFollowed = onSnapshot(qFollowed, (querySnapshot) => {
        setFollowed(!querySnapshot.empty);
    });

    const storage = getStorage(firebase_app);
    const [avatar, setAvatar] = React.useState<string>("");
    useEffect(() => {
        if (organizerProfilePhotoUrl.length > 0) {
            const reference = ref(storage, organizerProfilePhotoUrl);
            getDownloadURL(reference).then((url) => {
                setAvatar(url)
            });
        } else {
            setAvatar("")
        }
    }, [organizerProfilePhotoUrl]);

    // @ts-ignore
    let photos = [];
    const [p, setP] = React.useState(null);
    const [generalImages, setGeneralImages] = React.useState<string[]>([]);

    useEffect(() => {
        let imagesArr: string[] = [];
        async function getImages(reference: StorageReference) {
            await getDownloadURL(reference).then((url) => {
                imagesArr.push(url);
            });
            return imagesArr;
        }

        if (generalPhotoUrlsArr.length > 0) {
            setGeneralImages([])
            generalPhotoUrlsArr.map((url) => {
                const reference = ref(storage, url);
                getImages(reference).then((i) => {
                    if (generalPhotoUrlsArr.length == i.length) {
                        setGeneralImages(i)
                    }
                });
            })
        }
    }, [generalPhotoUrlsArr]);

    useEffect(() => {
        photos = [];
        if (generalImages.length > 0) {
            generalImages.map((photoUrl) => {
                photos.push(
                    <Grid item xs={12} sm={6} lg={4}>
                        <CardMedia
                            component="img"
                            height="200"
                            sx={{ maxWidth: 250, borderRadius: 2, margin: "0 5px"}}
                            image={photoUrl}
                            onClick={() => handleClickOpenImage(photoUrl)}
                            alt="post image"
                        />
                    </Grid>
                );
                // @ts-ignore
                setP(photos);
            })
        }
    }, [generalImages]);

    const [openImage, setOpenImage] = React.useState(false);
    const [imageOpened, setImageOpened] = React.useState("");
    const handleClickOpenImage = (image: string) => {
        setImageOpened(image);
        setOpenImage(true);
    };
    const handleCloseImage = () => {
        setOpenImage(false);
    };

    return (
        <Card sx={{ width: "60vw", margin: "0 auto" }}>
            <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${authorId}`}>
                <CardHeader
                    avatar={
                        <Link style={{ textDecoration: 'none', color: 'inherit' }} href={`/profile/${authorId}`}>
                            {
                                (avatar.length > 0) ? (
                                    <Avatar variant="rounded" src={avatar}>
                                        <AccountBoxIcon />
                                    </Avatar>
                                ) : (
                                    <Avatar sx={{ bgcolor: "primary.main" }} variant="rounded">
                                        <AccountBoxIcon />
                                    </Avatar>
                                )
                            }
                        </Link>
                    }
                    action={
                    <div>
                        {
                            own ? (
                                <div></div>
                            ) : (
                                followed ? (
                                            <Button sx={{color:"primary.dark"}} onClick={handleUnfollowed}>Вы подписаны</Button>
                                        ) : (
                                            <Button sx={{color:"primary.dark"}} onClick={handleFollowed}>Подписаться</Button>
                                        )
                            )
                        }
                    </div>
                    }
                    title={
                        <Typography color={"primary.dark"}>{authorName}</Typography>
                    }
                    subheader={dateCreated}
                />
            </Link>
            <CardContent>
                <Typography variant="body1" color="text.secondary">
                    {text}
                </Typography>
            </CardContent>

            <Grid sx={{padding: "0 10px 0 0"}} container spacing={1} >
                {p}
            </Grid>

            <CardActions >
                <div>
                    {
                        liked ? (
                            <div>
                                <IconButton onClick={handleDisliked} aria-label="like" sx={{ color: "red" }}>
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
                            <IconButton onClick={handleUnfavorite} aria-label="like" sx={{ color: "yellow" }}>
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

            <Dialog
                open={openImage}
                onClose={handleCloseImage}
                sx={{
                    "& .MuiDialog-container": {
                        "& .MuiPaper-root": {
                            width: "100%",
                            maxWidth: "80vw",
                        },
                    },
                }}
            >
                <DialogContent sx={{justifyContent: "center"}}>
                    <img
                        src={imageOpened}
                        loading="lazy"
                        style={{borderRadius:'10px', maxWidth: "70vw", margin: "0 auto"}}
                    />
                </DialogContent>
            </Dialog>

        </Card>
    );
}