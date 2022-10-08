import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: "https://picsum.photos/id/1/200/300"
    },
    role: {
        type: String,
        required: true,
        default: "user"
    },
})

mongoose.models = {}

export default mongoose.model('User', UserSchema)
