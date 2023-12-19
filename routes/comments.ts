/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: comments router for CapySocial
 */

import express from "express"
const router = express.Router()

import { createComment, getComments, updateComment } from "../controller"

router.route('/').post(createComment).get(getComments)
router.route('/:commentId').post(updateComment)
router.route('/delete/:commentId').post(updateComment)

module.exports = router 