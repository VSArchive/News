import Head from 'next/head'
import styles from '../styles/Home.module.css'
import mongoose from 'mongoose'
import Articles from '../models/article'
import { useEffect, useState } from 'react'
import Navbar from '../src/Components/Navbar/Navbar'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import { Button, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'

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
				<title title>DV News</title>
				<link rel="icon" href="/logo.png" />
			</Head>

			<Navbar user={user} />

			<main className={styles.main}>
				<div id="posts" className={styles.grid}>
					{
						articles.map(article => {
							const [ups, setUps] = useState(article.votes.ups)
							const [downs, setDowns] = useState(article.votes.downs)
							return (
								<Paper className={styles.card} key={article._id} onClick={() => {
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
										<Box
											sx={{
												padding: '20px',
												display: 'flex',
												flexDirection: 'row',
											}}>
											<Button
												onClick={async (e) => {
													e.stopPropagation()
													if (!user || !user._id) {
														window.location.href = `/login`
														return
													}
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
													if (!user || !user._id) {
														window.location.href = `/login`
														return
													}
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
									</Box>
								</Paper>
							)
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
	const articles = await Articles.find()
	return {
		props: {
			articles: JSON.parse(JSON.stringify(articles))
		}
	}
}

export default Home