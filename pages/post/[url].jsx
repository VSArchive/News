import Head from 'next/head'
import mongoose from 'mongoose'
import styles from '../../styles/Home.module.css'
import Article from '../../models/article'
import showdown from 'showdown'
import { useEffect, useState } from 'react'
import Navbar from '../../src/Components/Navbar/Navbar'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import { Button, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'

export default function Post({ article }) {
    const converter = new showdown.Converter({ tables: true, tasklists: true, tablesHeaderId: true, strikethrough: true, simplifiedAutoLink: true, ghCompatibleHeaderId: true, emoji: true }),
        text = article.longDescription,
        html = converter.makeHtml(text)

    const [user, setUser] = useState({})
    const [ups, setUps] = useState(article.votes.ups)
    const [downs, setDowns] = useState(article.votes.downs)

    useEffect(() => {
        if (localStorage.getItem('user')) {
            setUser(JSON.parse(localStorage.getItem('user')))
        }
    }, [])

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
        </div>
    )
}

export async function getServerSideProps(context) {
    try {
        mongoose.connect(process.env.mongodb)
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
