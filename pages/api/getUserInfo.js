import User from '../../models/user'

export default async function handler(req, res) {
    if (req.method === "POST") {
        const user = await User.findOne({ _id: req.body.id })
        if (!!user) {
            res.status(200).json(user)
        } else {
            res.status(400).json({
                error: "User not found"
            })
        }
    } else {
        res.status(400).json({
            error: "Invalid request"
        })
    }
}