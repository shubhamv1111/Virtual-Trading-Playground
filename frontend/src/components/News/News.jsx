import React, { useState, useEffect } from "react";
import {
    Typography,
    Container,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Link,
    Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Skeleton from "@material-ui/lab/Skeleton";
import Axios from "axios";
import InfiniteScroll from 'react-infinite-scroll-component';

const useStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    icon: {
        marginRight: theme.spacing(2),
    },
    cardMedia: {
        paddingTop: "56.25%", // 16:9
    },
    cardContent: {
        flexGrow: 1,
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    cardGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
}));

const LoadingCards = () => {
    return (
        <div>
            <br />
            <Grid container spacing={4}>
                {Array.from(new Array(9)).map((item, index) => (
                    <Grid item key={index} xs={12} sm={6} md={4}>
                        <Box key={index} width={210} marginRight={0.5}>
                            <Skeleton variant="rect" width={300} height={200} />

                            <Box pt={0.5}>
                                <Skeleton />
                                <Skeleton width="60%" />
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default function App() {

    const classes = useStyles();
    const [items, setItems] = useState([]);
    const [hasMore, setHasMore] = useState(true);

    const fetchMoreData = async () => {
        if (items.length >= 30) {
            setHasMore(false);
            return;
        }
        const page = Math.floor(items.length / 6) + 1;

        const url = `/api/news/${page}`;
        try {
            const response = await Axios.get(url);
            if(response.data.data.length==0){
                setHasMore(false);
                return;
            }
            setItems(items.concat(response.data.data));

        } catch (error) {
            setHasMore(false);
            console.error(error);
        }
    }
    useEffect(() => {
        fetchMoreData();
        // eslint-disable-next-line
    },[]);
    
    return (
        <Container className={classes.cardGrid}>
            <InfiniteScroll
                dataLength={items?.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<LoadingCards />}
                height={600}
                endMessage={
                    <h4 style={{ textAlign: 'center' }}>
                        <b>Thats all for today, Please Come tomorrow to read more news</b>
                    </h4>
                }
            >
                <Grid container spacing={4}>
                    {items?.map((item) => (
                        <Grid item key={item?.headline} xs={12} sm={6} md={4}>
                            <Card className={classes?.card}>
                                <Link href={item?.url} target="_blank" rel="noopener noreferrer">
                                    <CardMedia
                                        className={classes.cardMedia}
                                        image={item?.image}
                                        title={item?.headline}
                                    />
                                </Link>
                                <CardContent className={classes?.cardContent}>
                                    <Typography gutterBottom variant="h6" component="h4">
                                        {item?.headline}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            </InfiniteScroll>
        </Container>
    )
}