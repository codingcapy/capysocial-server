/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: comment votes router for CapySocial
 */

import express from "express"
const router = express.Router()

import { getCommentVotes, createCommentVote, updateCommentVote } from "../controller"

router.route('/').get(getCommentVotes).post(createCommentVote)
router.route('/:commentVoteId').post(updateCommentVote)

module.exports = router 