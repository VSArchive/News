export default function Logout() {
	localStorage.removeItem('user')
	window.location.href = '/'
	return (
		<div>
			Logging you out...
		</div>
	)
}