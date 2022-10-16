import Article from '../../models/article'
import User from '../../models/user'
import mongoose from 'mongoose'


export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            mongoose.connect(process.env.MONGODB_URL)
        } catch (error) {
            console.log(error)
        }
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
                if (article.createdBy.equals(user._id) || user.role === "admin"){
                    if (req.body.delete == "true") {
                        await article.delete()
                        res.status(200).json({
                            success: "Article deleted successfully"
                        })
                    } else {
                        article.updateOne({
                            title: req.body.title,
                            url: req.body.url,
                            imageUrl: req.body.imageUrl,
                            description: req.body.description,
                            longDescription: req.body.content,
                            createdBy: user._id,
                            comments: article.comments,
                            votes: article.votes
                        }, function (err) {
                            if (err) {
                                res.status(400).json({
                                    error: err
                                })
                            } else {
                                res.status(200).json({
                                    success: "Article modified successfully"
                                })
                            }
                        })
                    }
                }
            }
        }
    } else {
        res.status(400).json({
            error: "Invalid request"
        })
    }
}