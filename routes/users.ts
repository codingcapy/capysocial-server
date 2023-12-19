/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: users router for CapySocial
 */

import express from "express"
const router = express.Router()

import { createUser, getUser, updateUser } from "../controller"

router.route('/').post(createUser)
router.route('/update/:userId').post(updateUser)
router.route('/:userId').get(getUser)

module.exports = router 