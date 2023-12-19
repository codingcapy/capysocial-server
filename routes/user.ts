/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: user router for CapySocial
 */

import express from "express"
const router = express.Router()

import { validateUser, decryptToken } from "../controller"

router.route('/login').post(validateUser)
router.route('/validation').post(decryptToken)

module.exports = router 