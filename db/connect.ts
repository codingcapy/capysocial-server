/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: mongoDBconnect for CapySocial
 */

import mongoose from "mongoose"

export default function connectDB(url: any) {
    return mongoose.connect(url)
}

