/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: comment vote schema for CapySocial
 */

import mongoose from "mongoose";

const CommentVoteSchema = new mongoose.Schema({
    value: { type: Number, required: [true, 'value is required'] },
    postId: { type: Number, required: [true, 'postId is required'] },
    commentId: { type: Number, required: [true, 'commentId is required'] },
    voterId: { type: Number, required: [true, 'voterId is required'] },
    commentVoteId: { type: Number, required: [true, 'commentVoteId is required'] },
})

module.exports = mongoose.model('CommentVote', CommentVoteSchema)