import Article from '../../models/article'
import User from '../../models/user'

export default async function handler(req, res) {
    if (req.method === "POST") {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            res.status(400).json({
                error: "User not found"
            })
        } else {
            if (user && user.email) {
                let article = await Article.findOne({
                    url: req.body.url
                })

                article.comments.map((comment) => {
                    let voted = false
                    if (comment._id.equals(req.body.commentId)) {
                        comment.votes.by.map((voter) => {
                            if (voter.user.equals(user._id)) {
                                voted = true
                                voter.vote = req.body.vote
                            }
                        })
                        if (!voted) {
                            comment.votes.by.push({
                                user: user._id,
                                vote: req.body.vote
                            })
                        }
                    }
                })

                article.save(function (err,) {
                    if (err) {
                        res.status(400).json({
                            error: "Error saving article"
                        })
                    } else {
                        res.status(200).json({
                            success: "Article saved successfully",
                            votes: article.votes.by.length,
                            ups: article.votes.ups,
                            downs: article.votes.downs
                        })
                    }
                })
            }
        }
    } else {
        res.status(400).json({
            error: "Invalid request"
        })
    }
}