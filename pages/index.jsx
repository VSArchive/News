import Head from 'next/head'
import styles from '../styles/Home.module.css'
import mongoose from 'mongoose'
import Articles from '../models/article'
import { useEffect, useState } from 'react'
import { Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'

import Navbar from '../src/Components/Navbar/Navbar'
import Vote from '../src/Components/Vote/Vote'

const Posts = ({ article, user }) => {
	return (
		<Paper className={styles.card} onClick={() => {
			window.location.href = `/post/${article.url}`
		}}>
			<img src={article.imageUrl} className={styles.image} alt="image"></img>
			<Box sx={{
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '10px',
			}}>
				<Box sx={{
					width: 'auto',
					height: 'auto',
					display: 'flex',
					flexDirection: 'column',
				}}>
					<Typography sx={{
						fontSize: '20px',
						fontWeight: 'bold',
						padding: '10px',
						width: '100%',
					}} variant='h3'>{article.title}</Typography>
					<Typography sx={{
						fontSize: '20px',
						padding: '10px',
						width: '100%',
					}}>{article.description.substring(0, 100)}</Typography>
				</Box>
				<Vote article={article} user={user} />
			</Box>
		</Paper>
	)
}

const Home = ({ articles }) => {
	const [user, setUser] = useState({})
	useEffect(() => {
		if (localStorage.getItem('user')) {
			setUser(JSON.parse(localStorage.getItem('user')))
		}
	}, [])
	return (
		<div className={styles.container}>
			<Head>
				<title>DV News</title>
				<link rel="icon" href="/icon.svg" />
			</Head>

			<Navbar user={user} />

			<main className={styles.main}>
				<div id="posts" className={styles.grid}>
					{
						articles.map(article => {
							return <Posts key={article._id} article={article} user={user} />
						})
					}
				</div>
			</main>
		</div >
	)
}

export async function getServerSideProps() {
	try {
		mongoose.connect(process.env.MONGODB_URL)
		console.log("connected")
	} catch (error) {
		console.log(error)
	}
	let articles = await Articles.find()
	articles = JSON.parse(JSON.stringify(articles)).sort((a, b) => (b.votes.ups - b.votes.downs) - (a.votes.ups - a.votes.downs))
	mongoose.connection.close()
	return {
		props: {
			articles: articles
		}
	}
}

export default Home