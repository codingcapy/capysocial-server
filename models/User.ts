/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: user schema for CapySocial
 */

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: [true, 'username is required'], trim: true, maxlength: [80, 'username char limit is 80'] },
    password: { type: String, required: [true, 'password is required'], maxlength: [80, 'password char limit is 80'] },
    userId: Number
})

module.exports = mongoose.model('User', UserSchema)