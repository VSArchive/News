import { GoogleLogin } from '@react-oauth/google'
import { Paper, Typography } from "@mui/material"
import { Box } from '@mui/system'
import { useEffect } from 'react'

export default function Login() {
	useEffect(() => {
		const user = localStorage.getItem('user')
		if (!!user && user.email) {
			window.location.href = '/'
		}
	}, [])

	const responseGoogle = async (response) => {
		if (response && response.email) {
			const request = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(response)
			})
			if (request.status === 200) {
				const user = await request.json()
				localStorage.setItem('user', JSON.stringify(user))
				window.location.href = '/'
			} else {
				window.location.reload()
			}
		}
	}

	return (
		<div style={{ backgroundImage: `url('/background.webp')`, backgroundSize: '100%', height: '100vh', display: 'flex' }}>
			<Paper sx={{ width: '30%', margin: 'auto', height: '40vh', padding: '20px', display: 'flex', }} elevation={3}>
				<Box sx={{ margin: 'auto', height: '100%' }}>
					<Typography variant="h5" style={{ textAlign: 'center' }}>
						Login/Signup
					</Typography>
					<Box sx={{ marginTop: '100px' }}>
						<GoogleLogin
							onSuccess={credentialResponse => {
								const base64Payload = credentialResponse.credential.split('.')[1]
								const payload = Buffer.from(base64Payload, 'base64')
								const userProfile = JSON.parse(payload)
								console.log(userProfile)
								responseGoogle(userProfile)
							}}
							onError={() => {
								console.log('Login Failed')
							}}
							useOneTap
						/>
					</Box>
				</Box>
			</Paper>
		</div>
	)

}