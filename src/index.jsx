import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './Components/App/App'
// import Docs from './Components/Docs/Docs'
import Login from './Components/Login/Login'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Logout from './Components/Logout/Logout'
import { StyledEngineProvider } from '@mui/material/styles'
import { GoogleOAuthProvider } from '@react-oauth/google'


const root = document.getElementById('root')

ReactDOM.createRoot(root).render(
	<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
		<StyledEngineProvider injectFirst>
			<BrowserRouter>
				<Routes>
					<Route exact path="/" element={<App />} />
					<Route path="/login" element={<Login />} />
					<Route path="/logout" element={<Logout />} />
				</Routes>
			</BrowserRouter>
		</StyledEngineProvider>
	</GoogleOAuthProvider>
)
