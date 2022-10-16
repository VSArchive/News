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
                let article = new Article({
                    title: req.body.title,
                    url: req.body.url,
                    imageUrl: req.body.imageUrl,
                    description: req.body.description,
                    longDescription: req.body.content,
                    createdBy: user._id,
                })

                try {
                    const newArticle = await article.save()
                    res.status(200).json(newArticle)
                } catch (error) {
                    res.status(400).json({
                        error: error
                    })
                }                
            } else {
                res.status(400).json({
                    error: "invalid email"
                })
            }
        }
        // mongoose.connection.close()
    } else {
        res.status(400).json({
            error: "Invalid request"
        })
    }
}