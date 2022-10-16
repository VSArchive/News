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
        if (!!user) {
            res.status(200).json(user)
        } else {
            const user = new User({
                email: req.body.email,
                firstName: req.body.given_name,
                lastName: req.body.family_name,
                profilePicture: req.body.picture
            })
            user.save(function (err, user) {
                if (err) {
                    res.status(400).json({
                        error: "Error creating user"
                    })
                } else {
                    res.status(200).json(user)
                }
            })
        }
        // mongoose.connection.close()
    } else {
        res.status(400).json({
            error: "Invalid request"
        })
    }
}