import Navbar from "../Navbar/Navbar"
import { useState, useEffect } from 'react'

const SERVER = import.meta.env.VITE_BACKEND_URL

function App() {
	const user = JSON.parse(localStorage.getItem('user'))
	if (!!!user) {
		window.location.href = '/login'
	}

	return (
		<div style={{ backgroundColor: '#F5F5F5' }}>
			<Navbar user={user}/>
			
		</div>
	)
}

export default App
