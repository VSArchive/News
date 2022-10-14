import { useEffect, useState } from 'react'
import { Button, Paper, Typography } from '@mui/material'
import { Box } from '@mui/system'

import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt'
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt'
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt'

const Vote = ({ article, user }) => {
    const [ups, setUps] = useState(article.votes.ups)
    const [downs, setDowns] = useState(article.votes.downs)
    const [voted, setVoted] = useState([false, false])

    useEffect(() => {
        article.votes.by.map((usr) => {
            if (user._id == usr.user) {
                setVoted([true, usr.vote])
            }
        })
    }, [article, user])

    return (
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
                        setVoted([true, true])
                        setUps(response.ups)
                        setDowns(response.downs)
                    }
                }}>
                {(voted[0] && voted[1]) ? (<ThumbUpAltIcon />) : (<ThumbUpOffAltIcon />)}
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
                        setVoted([true, false])
                        setUps(response.ups)
                        setDowns(response.downs)
                    }
                }}>
                {(voted[0] && !voted[1]) ? (<ThumbDownAltIcon />) : (<ThumbDownOffAltIcon />)}
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
    )
}

export default Vote