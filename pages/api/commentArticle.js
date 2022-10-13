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

                let commentCount = 0
                article.comments.map((comment) => {
                    if (comment.by.equals(user._id)) {
                        commentCount++
                    }
                })

                if (commentCount > 5) {
                    return res.status(400).json({
                        error: "Comment limit reached"
                    })
                }

                article.comments.push({
                    by: user._id,
                    comment: req.body.comment
                })

                article.save().then(async (article) => {
                    for (let i = 0; i < article.comments.length; i++) {
                        let comment = article.comments[i]
                        let user = await User.findOne({ _id: comment.by })
                        comment.by = user
                    }
                    return res.status(200).json({
                        success: "Article saved successfully",
                        comments: article.comments
                    })
                }).catch((err) => {
                    console.log(err)
                    return res.status(400).json({
                        error: "Error saving article"
                    })
                })
            }
        }
    } else {
        return res.status(400).json({
            error: "Invalid request"
        })
    }
}