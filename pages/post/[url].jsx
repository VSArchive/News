import Head from 'next/head'
import mongoose from 'mongoose'
import styles from '../../styles/Home.module.css'
import Article from '../../models/article'
import showdown from 'showdown'
import { useEffect, useState, forwardRef } from 'react'
import Navbar from '../../src/Components/Navbar/Navbar'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import { Avatar, Button, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function Post({ article }) {
    const converter = new showdown.Converter({ tables: true, tasklists: true, tablesHeaderId: true, strikethrough: true, simplifiedAutoLink: true, ghCompatibleHeaderId: true, emoji: true }),
        text = article.longDescription,
        html = converter.makeHtml(text)

    const [user, setUser] = useState({})
    const [ups, setUps] = useState(article.votes.ups)
    const [downs, setDowns] = useState(article.votes.downs)
    const [comment, setComment] = useState('')
    const [comments, setComments] = useState(article.comments)

    const [snackBarState, setSnackBarState] = useState(false)
    const [errorSnackBarState, setErrorSnackBarState] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState('')

    useEffect(() => {
        if (localStorage.getItem('user')) {
            setUser(JSON.parse(localStorage.getItem('user')))
        }
    }, [])

    useEffect(() => {
        async function updateComments() {
            for (let i = 0; i < article.comments.length; i++) {
                let comment = article.comments[i]
                const userRequest = await fetch('/api/getUserInfo', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: comment.by
                    })
                })

                const userResponse = await userRequest.json()
                comment.by = userResponse
                setComments([...comments])
            }
        }

        updateComments()
    }, [])

    const handleSnackBarClose = () => {
        setSnackBarState(false)
        setErrorSnackBarState(false)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>{article.title}</title>
                <link rel="icon" href="/logo.png" />
            </Head>

            <Navbar user={user} />

            <h1 className={styles.title}>{article.title}</h1>

            <Box
                sx={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                }}>
                <Button
                    onClick={async (e) => {
                        e.stopPropagation()
                        const request = await fetch('/api/voteArticle', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                url: article.url,
                                vote: true,
                                email: user.email
                            })
                        })
                        if (request.status === 200) {
                            const response = await request.json()
                            setUps(response.ups)
                            setDowns(response.downs)
                        }
                    }}>
                    <ThumbUpOffAltIcon />
                </Button>
                <Typography
                    sx={{
                        padding: '0 !important',
                        width: '30px !important',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                    }}
                >
                    {ups}
                </Typography>
                <Button
                    onClick={async (e) => {
                        e.stopPropagation()
                        const request = await fetch('/api/voteArticle', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                url: article.url,
                                vote: false,
                                email: user.email
                            })
                        })
                        if (request.status === 200) {
                            const response = await request.json()
                            setUps(response.ups)
                            setDowns(response.downs)
                        }
                    }}>
                    <ThumbDownOffAltIcon />
                </Button>
                <Typography
                    sx={{
                        padding: '0 !important',
                        width: '30px !important',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                    }}
                >
                    {downs}
                </Typography>
            </Box>
            <main className={styles.main}>
                <div dangerouslySetInnerHTML={{
                    __html: html
                }} className={styles.description}></div>
            </main>
            <Box sx={{
                height: '200px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
            }}>
                {
                    comments.sort((a, b) => {
                        return (new Date(b.commentedAt).getTime() - new Date(a.commentedAt).getTime())
                    }).map((comment, index) => {
                        return (
                            <Paper
                                key={index}
                                sx={{
                                    padding: '10px',
                                    margin: '10px',
                                }}
                            >
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                                    <Avatar xs={4} sx={{
                                        margin: 'auto 10px',
                                    }} src={comment.by.profilePicture} />
                                    <Box xs={8} sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        width: '100%',
                                        padding: '0 10px',
                                    }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>{comment.by.firstName}</Typography>
                                        <Typography
                                            sx={{
                                                margin: 'auto',
                                                width: '100%',
                                            }}
                                        >
                                            {comment.comment}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        )
                    })
                }
            </Box>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                padding: '10px',
            }}>
                <TextField sx={{
                    width: '100%',

                }} value={comment} onChange={(e) => {
                    setComment(e.target.value)
                }} />
                <Button sx={{
                    margin: 'auto',
                }} onClick={async () => {
                    const request = await fetch('/api/commentArticle', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: user.email,
                            url: article.url,
                            comment: comment
                        })
                    })
                    if (request.status === 200) {
                        const response = await request.json()
                        setComments(response.comments)
                        setComment('')
                        setSnackBarMessage(response.success)
                        setSnackBarState(true)
                    } else {
                        const response = await request.json()
                        setSnackBarMessage(response.error)
                        setErrorSnackBarState(true)
                    }
                }}>
                    <Typography>
                        Comment
                    </Typography>
                </Button>
            </Box>

            <Snackbar open={snackBarState} autoHideDuration={5000} onClose={handleSnackBarClose}>
                <Alert severity="success" sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
            <Snackbar open={errorSnackBarState} autoHideDuration={5000} onClose={handleSnackBarClose}>
                <Alert severity="error" sx={{ width: '100%' }}>
                    {snackBarMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}

export async function getServerSideProps(context) {
    try {
        mongoose.connect(process.env.MONGODB_URL)
    } catch (error) {
        console.log(error)
    }

    const article = await Article.findOne({ url: context.query.url })
    return {
        props: {
            article: JSON.parse(JSON.stringify(article))
        }
    }
}
