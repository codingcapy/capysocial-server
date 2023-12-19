/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: posts router for CapySocial
 */

import express from "express"
const router = express.Router()

import { createPost, getPosts, getPost, updatePost } from "../controller"

router.route('/').get(getPosts).post(createPost)
router.route('/:postId').get(getPost).post(updatePost)
router.route('/delete/:postId').post(updatePost)

module.exports = router 