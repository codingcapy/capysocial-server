
/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: web server script for CapySocial
 */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./db/connect"; './db/connect';
require('dotenv').config()
const users = require('./routes/users')
const mPosts = require('./routes/posts')
const mUser = require('./routes/user')
const mComments = require('./routes/comments')
const mNested = require('./routes/nested')
const mVotes = require('./routes/postvotes')
const mCommentVotes = require('./routes/commentvotes')
const mNestedCommentVotes = require('./routes/nestedcommentvotes')

const cron = require('cron')
const https = require('https')

const backendUrl = "https://capysocial.onrender.com/"
const job = new cron.CronJob("*/14 * * * *", ()=>{
    console.log("restarting server")
    https.get(backendUrl,(res:any)=>{
        if (res.statusCode === 200){
            console.log('Server restarted')
        }
        else{
            console.log('failed to restart')
        }
    })
})

job.start()

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get("/", (req, res) => {
    res.send("welcome");
})

app.use('/api/user', mUser)

app.use("/api/users", users)

app.use('/api/posts', mPosts)

app.use('/api/comments', mComments)

app.use('/api/nested', mNested)

app.use('/api/votes', mVotes)

app.use('/api/commentvotes', mCommentVotes)

app.use('/api/nestedcommentvotes', mNestedCommentVotes)

async function start() {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server listening on port: ${port}`));
    }
    catch (err) {
        console.log(err)
    }
}

start()

