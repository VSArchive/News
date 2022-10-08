import { GoogleLogin } from '@react-oauth/google';
import { Paper, Typography } from "@mui/material"
import { Box } from '@mui/system'

export default function Login() {
	const user = localStorage.getItem('user')
	if (!!user && user.email) {
		window.location.href = '/'
		return (
			<div>Redirecting...</div>
		)
	} else {
		const responseGoogle = (response) => {
			if (response && response.email) {
				localStorage.setItem('user', JSON.stringify(response))
				window.location.href = '/'
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
}