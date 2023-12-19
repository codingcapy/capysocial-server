/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: nested comment vote schema for CapySocial
 */

import mongoose from "mongoose";

const NestedCommentVoteSchema = new mongoose.Schema({
    value: { type: Number, required: [true, 'value is required'] },
    postId: { type: Number, required: [true, 'postId is required'] },
    commentId: { type: Number, required: [true, 'commentId is required'] },
    nestedCommentId: { type: Number, required: [true, 'nestedCommentId is required'] },
    voterId: { type: Number, required: [true, 'voterId is required'] },
    nestedCommentVoteId: { type: Number, required: [true, 'nestedCommentVoteId is required'] },
})

module.exports = mongoose.model('NestedCommentVote', NestedCommentVoteSchema)