import User from '../../models/user'
import mongoose from 'mongoose'

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            mongoose.connect(process.env.MONGODB_URL)
        } catch (error) {
            console.log(error)
        }
        const user = await User.findOne({ _id: req.body.id })
        if (!!user) {
            res.status(200).json(user)
        } else {
            res.status(400).json({
                error: "User not found"
            })
        }
        // mongoose.connection.close()
    } else {
        res.status(400).json({
            error: "Invalid request"
        })
    }
}