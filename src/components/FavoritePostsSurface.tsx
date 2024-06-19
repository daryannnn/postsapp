import {
    Autocomplete,
    Box,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    MenuList,
    OutlinedInput,
    Paper,
    Select,
    SelectChangeEvent,
    TextField, ThemeProvider,
    Typography
} from "@mui/material";
import Link from "next/link";
import React, {lazy} from "react";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import {blue} from "@mui/material/colors";
import FavoritePosts from "@/components/FavoritePosts";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import {theme} from "@/utils/theme";

interface Props {
    currentUserId: string,
}

export default function FavoriteEventsSurface(props: Props) {
    return (
        <ThemeProvider theme={theme}>
        <Box sx={{display: "flex", justifyContent: "space-between"}}>
            <Paper sx={{ width:"65vw", margin: "30px auto", padding: "0 0 10px 0", bgcolor: "primary.light" }}>
                <Box sx={{ flexDirection: 'row', bgcolor: "primary.main", display: 'flex', justifyContent: 'space-between', padding: "10px", margin: "0 0 10px 0", borderRadius: 1}}>
                    <Box sx={{ display: 'flex', justifyContent: 'start' }}>
                        <TextSnippetIcon sx={{margin: "5px 10px 0 0", color: "primary.dark"}} />
                        <Typography sx={{margin: "4px 0 0 0"}} display="inline" variant="h6">Избранные публикации</Typography>
                    </Box>
                </Box>

                <FavoritePosts id={props.currentUserId} />

            </Paper>

            <Box sx={{display: "flex", justifyContent: "end"}}>
                <MenuList sx={{margin: "30px", width: "15vw"}}>
                    <MenuItem selected>Публикации</MenuItem>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/favorites/events"}>
                        <MenuItem>Мероприятия</MenuItem>
                    </Link>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/favorites/programs"}>
                        <MenuItem>Услуги</MenuItem>
                    </Link>
                </MenuList>
            </Box>
        </Box>
        </ThemeProvider>
    )
}