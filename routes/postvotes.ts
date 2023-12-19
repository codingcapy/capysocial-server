/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: post votes router for CapySocial
 */

import express from "express"
const router = express.Router()

import { getVotes, createVote, updateVote } from "../controller"

router.route('/').get(getVotes).post(createVote)
router.route('/:postVoteId').post(updateVote)

module.exports = router 