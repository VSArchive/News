import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import MenuItem from '@mui/material/MenuItem'
import { Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

const settings = ['Profile', 'Logout']

const Navbar = ({ user }) => {
    const [anchorElUser, setAnchorElUser] = React.useState(null)

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget)
    }

    const handleCloseUserMenu = (event) => {
        if (event.target.childNodes[0] && event.target.childNodes[0].nodeValue === 'Profile') {
            window.location.href = '/profile'
        } else if (event.target.childNodes[0] && event.target.childNodes[0].nodeValue === 'Logout') {
            window.location.href = '/logout'
        } else {
            setAnchorElUser(null)
        }
    }

    return (
        <AppBar position="static">
            <Container>
                <Toolbar disableGutters sx={{ display: "flex", flexDirection: 'row', justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        noWrap
                        onClick={() => window.location.href = '/'}
                        component="div"
                        sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, cursor: 'pointer' }}
                    >
                        <img src='/logo.svg' />
                    </Typography>
                    <Box sx={{ display: 'flex' }}>

                        {(user && user.email) ? (
                            <Box>
                                <Button onClick={() => {
                                    window.location.href = "/new"
                                }}>
                                    <AddIcon sx={{
                                        color: "white"
                                    }} />
                                </Button>
                                <Tooltip title="Open settings">
                                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                        <Avatar alt="User" src={user.profilePicture} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        ) : (
                            <Button
                                onClick={() => window.location.href = '/login'}
                                variant="contained"
                                color="primary"
                                sx={{ margin: '20px', width: '100%', marginLeft: '0px' }}>
                                <Typography>
                                    Sign In
                                </Typography>
                            </Button>
                        )}
                        <Box sx={{ flexGrow: 0 }}>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">{setting}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    )
}
export default Navbar
