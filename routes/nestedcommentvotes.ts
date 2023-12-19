/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: nested comment votes router for CapySocial
 */

import express from "express"
const router = express.Router()

import { getNestedCommentVotes, createNestedCommentVote, updateNestedComment, updateNestedCommentVote } from "../controller"

router.route('/').get(getNestedCommentVotes).post(createNestedCommentVote)
router.route('/:nestedCommentVoteId').post(updateNestedCommentVote)

module.exports = router 