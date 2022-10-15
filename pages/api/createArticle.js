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
                let article = new Article({
                    title: req.body.title,
                    url: req.body.url,
                    imageUrl: req.body.imageUrl,
                    description: req.body.description,
                    longDescription: req.body.content,
                    createdBy: user._id,
                })
                article.save(function (err) {
                    if (err) {
                        console.log(err)
                        res.status(400).json({
                            error: "Error saving article"
                        })
                    } else {
                        res.status(200).json({
                            success: "Article saved successfully"
                        })
                    }
                })
            } else {
                res.status(400).json({
                    error: "invalid email"
                })
            }
        }
    } else {
        res.status(400).json({
            error: "Invalid request"
        })
    }
}