const {Schema, model} = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: String,
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false

    },
    role: {
        type: String,
        default: "role_user",
        select: false
    },
    image: {
        type: String,
        default: "default.png"
    },
    create_ad: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("User", UserSchema, "users")