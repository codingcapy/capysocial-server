/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: posts schema for CapySocial
 */

import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: { type: String, required: [true, 'title is required'], trim: true, maxlength: [300, 'title char limit is 300'] },
    content: { type: String, required: [true, 'content is required'], maxlength: [40000, 'content char limit is 40000'] },
    userId: { type: Number, required: [true, 'userId is required'] },
    date: { type: String, required: [true, 'date is required'] },
    postId: { type: Number, required: [true, 'postId is required'] },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false }
})

module.exports = mongoose.model('Post', PostSchema)