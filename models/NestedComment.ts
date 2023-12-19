/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: nested comment schema for CapySocial
 */

import mongoose from "mongoose";

const NestedCommentSchema = new mongoose.Schema({
    content: { type: String, required: [true, 'content is required'], maxlength: [10000, 'content char limit is 10000'] },
    postId: { type: Number, required: [true, 'postId is required'] },
    commentId: { type: Number, required: [true, 'commentId is required'] },
    userId: { type: Number, required: [true, 'userId is required'] },
    date: { type: String, required: [true, 'date is required'] },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    nestedCommentId: { type: Number, required: [true, 'nestedCommentId is required'] },
})

module.exports = mongoose.model('NestedComment', NestedCommentSchema)