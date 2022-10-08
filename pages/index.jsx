import Head from 'next/head'
import styles from '../styles/Home.module.css'
import mongoose from 'mongoose'
import Articles from '../models/article'
import { useEffect, useState } from 'react'
import Navbar from '../src/Components/Navbar/Navbar'

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
				<title title>Vineel Sai | Blog</title>
				<meta name="description" content="Blog by Vineel Sai"></meta>
				<link rel="icon" href="/logo.png" />
			</Head>

			<Navbar user={user} />

			<main className={styles.main}>
				<div id="about">
				</div>
				<div id="posts" className={styles.grid}>
					{
						articles.map(article => (
							<a href={"post/" + article.url} className={styles.card} key={article._id}>
								<img src={article.imageUrl} className={styles.image} alt="image"></img>
								<h3>{article.title}</h3>
								<p>{article.description.substring(0, 100)}</p>
							</a>
						))
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