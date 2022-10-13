import mongoose from "mongoose"

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    vote: {
        type: Boolean,
        required: true
    }
})

const votesSchema = new mongoose.Schema({
    ups: {
        type: Number,
        default: 0
    },
    downs: {
        type: Number,
        default: 0
    },
    by: {
        type: [voteSchema],
        default: []
    },
})

const commentsSchema = new mongoose.Schema({
    by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: true
    },
    votes: {
        type: votesSchema,
        default: {
            ups: 0,
            downs: 0,
            by: []
        }
    },
    commentedAt: {
        type: Date,
        default: Date.now(),
    }
})

const articleSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    longDescription: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    votes: {
        type: votesSchema,
        required: true,
        default: {
            ups: 0,
            downs: 0,
            by: []
        }
    },
    comments: {
        type: [commentsSchema],
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

votesSchema.pre('save', function (next) {
    var votes = this
    votes.ups = votes.by.filter(vote => vote.vote).length
    votes.downs = votes.by.filter(vote => !vote.vote).length
    next()
})

mongoose.models = {}

const Article = mongoose.model('Article', articleSchema)

export default Article