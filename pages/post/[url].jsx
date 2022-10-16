import Head from 'next/head'
import mongoose from 'mongoose'
import styles from '../../styles/Home.module.css'
import Article from '../../models/article'
import ReactMarkdown from 'react-markdown'
import { useEffect, useState, forwardRef } from 'react'
import Navbar from '../../src/Components/Navbar/Navbar'
import { Avatar, Button, Paper, TextField, Typography } from '@mui/material'
import { Box } from '@mui/system'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import gfm from 'remark-gfm'
import Vote from '../../src/Components/Vote/Vote'

import EditIcon from '@mui/icons-material/Edit'


const Alert = forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function Post({ article }) {
    const [user, setUser] = useState({})
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

        async function updateBy() {
            const userRequest = await fetch('/api/getUserInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: article.createdBy
                })
            })

            const userResponse = await userRequest.json()
            article.createdBy = userResponse
        }

        updateBy()
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
                <link rel="icon" href={article.imageUrl} />
            </Head>

            <Navbar user={user} />

            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <Typography sx={{
                    fontSize: '50px',
                    fontWeight: 'bold',
                    padding: '20px'
                }} variant='h1'>{article.title}</Typography>
                <Button sx={{
                    display: (user._id !== article.createdBy._id) ? 'none' : 'block',
                }} onClick={
                    () => {
                        if (user._id === article.createdBy._id) {
                            window.location.href = `/edit/${article.url}`
                        }
                    }
                } disabled={
                    user._id !== article.createdBy._id
                }>
                    <EditIcon />
                </Button>
            </Box>

            <Typography sx={{
                fontSize: '22px',
                padding: '10px'
            }} variant='h4'>{article.description}</Typography>
            <Box sx={{
                display: 'flex',
                flexDirection: 'row',
            }}>
                <Avatar src={article.createdBy.profilePicture} />
                <Typography sx={{
                    margin: 'auto 0',
                    padding: '0 10px'
                }}>By {article.createdBy.firstName}</Typography>
            </Box>

            <Vote article={article} user={user} />
            <img style={{
                width: 'auto',
                height: '300px',
            }} src={article.imageUrl} />
            <Box sx={{
                padding: '20px',
                width: '80%',
                margin: '0 auto',
            }}>
                <ReactMarkdown rehypePlugins={[gfm]}>
                    {article.longDescription}
                </ReactMarkdown>
            </Box>
            <Box sx={{
                height: '200px',
                width: '80%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
                margin: '0 auto',
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
                width: '80%',
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
    mongoose.connection.close()
    return {
        props: {
            article: JSON.parse(JSON.stringify(article))
        }
    }
}
