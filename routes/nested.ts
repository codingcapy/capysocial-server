/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: nested comment router for CapySocial
 */

import express from "express"
const router = express.Router()

import { createNestedComment, getNestedComments, updateNestedComment } from "../controller"

router.route('/').get(getNestedComments).post(createNestedComment)
router.route('/:nestedCommentId').post(updateNestedComment)
router.route('/delete/:nestedCommentId').post(updateNestedComment)

module.exports = router 