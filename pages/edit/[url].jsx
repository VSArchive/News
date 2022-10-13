import Head from 'next/head'
import mongoose from 'mongoose'
import styles from '../../styles/Home.module.css'
import Article from '../../models/article'
import { useEffect, useState, forwardRef } from 'react'
import Navbar from '../../src/Components/Navbar/Navbar'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'

const Alert = forwardRef(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

export default function EditPost({ article }) {

    const [user, setUser] = useState({})

    const [title, setTitle] = useState(article.title)
    const [description, setDescription] = useState(article.description)
    const [imageUrl, setImageUrl] = useState(article.imageUrl)
    const [url, setUrl] = useState(article.url)
    const [content, setContent] = useState(article.longDescription)
    
    const [snackBarState, setSnackBarState] = useState(false)
    const [errorSnackBarState, setErrorSnackBarState] = useState(false)
    const [snackBarMessage, setSnackBarMessage] = useState('')

    useEffect(() => {
        if (localStorage.getItem('user')) {
            setUser(JSON.parse(localStorage.getItem('user')))
        } else {
            window.location.href = '/login'
        }
    }, [])

    const handleSnackBarClose = () => {
        setSnackBarState(false)
        setErrorSnackBarState(false)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Edit Article</title>
                <link rel="icon" href="/logo.png" />
            </Head>

            <Navbar user={user} />

            <main className={styles.main}>
                <div className={styles.grid}>
                    <div>
                        <input id="title" name="title" className={styles.textBox} onChange={(e) => {
                            setTitle(e.target.value)
                        }} placeholder="Title" value={title} required />
                        <input id="url" name="url" className={styles.textBox} onChange={(e) => {
                            setUrl(e.target.value)
                        }} placeholder="Url" value={url} required readOnly />
                        <input id="imageUrl" name="imageUrl" className={styles.textBox} onChange={(e) => {
                            setImageUrl(e.target.value)
                        }} placeholder="Image Url" value={imageUrl} required />
                        <textarea id="description" name="description" className={styles.textBox} onChange={(e) => {
                            setDescription(e.target.value)
                        }} rows={5} placeholder="Description" value={description} required></textarea>
                        <textarea id="content" name="content" className={styles.textBox} onChange={(e) => {
                            setContent(e.target.value)
                        }} rows={20} placeholder="Content" value={content} required></textarea>
                        <button onClick={async () => {
                            const article = {
                                title: title,
                                description: description,
                                imageUrl: imageUrl,
                                url: url,
                                content: content,
                                email: user.email
                            }
                            const request = await fetch('/api/editArticle', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(article)
                            })

                            if (request.status === 200) {
                                const response = await request.json()
                                setSnackBarMessage(response.success)
                                setSnackBarState(true)
                            } else {
                                const response = await request.json()
                                setSnackBarMessage(response.error)
                                setErrorSnackBarState(true)
                            }
                        }} className={styles.submit}>Publish</button>
                    </div>
                </div>
            </main>
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
        </div >
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
