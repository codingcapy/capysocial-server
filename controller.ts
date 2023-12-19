
/*
author: Paul Kim
date: November 13, 2023
version: 1.0
description: controller for CapySocial
 */

import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const NestedComment = require('./models/NestedComment');
const PostVote = require('./models/PostVote');
const CommentVote = require('./models/CommentVote');
const NestedCommentVote = require('./models/NestedCommentVote');
const bcrypt = require('bcrypt');

const saltRounds = 6;

export interface IDecodedUser {
    userId: number
};

export async function validateUser(req: Request, res: Response) {
    const users = await User.find({})
    const { username, password } = req.body
    const user = users.find((user: any) => {
        return user.username === username;
    })
    if (!user) return res.json({ result: { user: null, token: null } });;
    bcrypt.compare(password, user.password, function (err: any, result: boolean) {
        if (result === true) {
            const token = jwt.sign({ id: user.userId }, "secret", { expiresIn: "2days" });
            res.json({ result: { user, token } });
        }
        else {
            return res.json({ result: { user: null, token: null } });
        }
    })
}

export async function decryptToken(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(403).send("Header does not exist");
            return "";
        }
        const token = authHeader.split(" ")[1];
        const decodedUser = jwt.verify(token, "secret");
        const user = searchUserById((decodedUser as IDecodedUser).userId);
        res.json({ result: { user, token } });
    }
    catch (err) {
        res.status(401).json({ err });
    }
}

export async function searchUserById(userId: number) {
    const users = await User.find({})
    const user = users.find((user: any) => user.userId === userId);
    // if (!user) throw new Error("User not found");
    return user;
}

export async function getUser(req: Request, res: Response) {
    const userId = req.params.userId;
    const user = await User.find({ userId: parseInt(userId) })
    const userPosts = await Post.find({ userId: parseInt(userId) })
    const postsDisplay = userPosts.map((post: any) => ({ ...post, userName: user.username }))
    const userComments = await Comment.find({ userId: parseInt(userId) })
    const commentsDisplay = userComments.map((comment: any) => ({ ...comment, userName: user.username }));
    const userNestedComments = await NestedComment.find({ userId: parseInt(userId) })
    const nestedCommentsDisplay = userNestedComments.map((nestedComment: any) => ({ ...nestedComment, userName: user.username }))
    res.json({ posts: userPosts, comments: userComments, nestedComments: userNestedComments });
}

export async function createUser(req: Request, res: Response) {
    const users = await User.find({})
    const userId = users.length === 0 ? 1 : users[users.length - 1].userId + 1;
    const username = req.body.username;
    const password = req.body.password;
    console.log(users.find((user: any) => user.username === username.toString()))
    if (users.find((user: any) => user.username === username.toString())) {
        res.json({ success: false, message: "Username already exists" })
    }
    else {
        console.log(users.find((user: any) => user.username === username.toString()))
        const encrypted = await bcrypt.hash(password, saltRounds)
        const user = await User.create({ username: username, password: encrypted, userId: userId })
        res.status(200).json({ success: true, message: "Sign up successful!" })
    }
}

export async function updateUser(req: Request, res: Response) {
    const userId = await parseInt(req.params.userId)
    const incomingUser = await req.body;
    const incomingPassword = incomingUser.password
    const encrypted = await bcrypt.hash(incomingPassword, saltRounds)
    const updatedUser = await User.findOneAndUpdate(
        { userId: userId },
        { username: incomingUser.username, password: encrypted, userId: incomingUser.userId },
        { new: true }
    );
    res.status(200).json({ success: true });

}

export async function getPosts(req: Request, res: Response) {
    try {
        const posts = await Post.find({})
        const comments = await Comment.find({})
        const nestedComments = await NestedComment.find({})
        const postVotes = await PostVote.find({})
        const users = await User.find({})
        const postsDisplay = posts.map((post: any) => ({ ...post, userName: users.find((user: any) => user.userId === post.userId).username, comments: comments.filter((comment: any) => comment.postId === post.postId), nestedComments: nestedComments.filter((nestedComment: any) => nestedComment.postId === post.postId), postVotes: postVotes.filter((postVote: any) => postVote.postId === post.postId) }));
        res.json(postsDisplay);
    }
    catch (err) {
        res.status(500).json({ msg: err })
    }
}

export async function getPost(req: Request, res: Response) {
    const postId = req.params.postId;
    const post = await Post.findOne({ postId: parseInt(postId) })
    const comments = await Comment.find({ postId: parseInt(postId) })
    const nestedComments = await NestedComment.find({ postId: parseInt(postId) })
    const postVotes = await PostVote.find({ postId: parseInt(postId) })
    const commentVotes = await CommentVote.find({ postId: parseInt(postId) })
    const nestedCommentVotes = await NestedCommentVote.find({ postId: parseInt(postId) })
    const users = await User.find({})
    const postDisplay = { ...post, userName: users.find((user: any) => user.userId === post.userId).username }
    const commentsDisplay = comments.map((comment: any) => ({ ...comment, userName: users.find((user: any) => user.userId === comment.userId).username }));
    const nestedCommentsDisplay = nestedComments.map((nestedComment: any) => ({ ...nestedComment, userName: users.find((user: any) => user.userId === nestedComment.userId).username }))
    if (!post) {
        res.status(404).json({ error: "Post not found" });
    }
    else {
        res.json({ post: postDisplay, comments: commentsDisplay, nestedComments: nestedCommentsDisplay, postVotes: postVotes, commentVotes: commentVotes, nestedCommentVotes: nestedCommentVotes });
    }

}

export async function createPost(req: Request, res: Response) {
    const posts = await Post.find({})
    const postId = posts.length === 0 ? 1 : posts[posts.length - 1].postId + 1;
    const incomingPost = req.body
    const post = await Post.create({ ...incomingPost, postId: postId })
    res.status(200).json({ success: true })
}

export async function getComments(req: Request, res: Response) {
    const comments = await Comment.find({})
    res.json(comments)
}

export async function createComment(req: Request, res: Response) {
    const comments = await Comment.find({})
    const commentId = comments.length === 0 ? 1 : comments[comments.length - 1].commentId + 1;
    const incomingComment = req.body
    const comment = await Comment.create({ ...incomingComment, commentId: commentId })
    res.status(200).json({ success: true })
}

export async function getNestedComments(req: Request, res: Response) {
    const nestedComments = await NestedComment.find({})
    res.json(nestedComments)
}

export async function createNestedComment(req: Request, res: Response) {
    const nestedComments = await NestedComment.find({})
    const nestedCommentId = nestedComments.length === 0 ? 1 : nestedComments[nestedComments.length - 1].nestedCommentId + 1;
    const incomingNestedComment = req.body
    const nestedComment = await NestedComment.create({ ...incomingNestedComment, nestedCommentId: nestedCommentId })
    res.status(200).json({ success: true })
}

export async function getVotes(req: Request, res: Response) {
    const postVotes = await PostVote.find({})
    res.json(postVotes)
}

export async function createVote(req: Request, res: Response) {
    const postVotes = await PostVote.find({})
    const postVoteId = postVotes.length === 0 ? 1 : postVotes[postVotes.length - 1].postVoteId + 1
    const incomingVote = req.body
    const postVote = await PostVote.create({ ...incomingVote, postVoteId: postVoteId })
    res.status(200).json({ success: true })
}

export async function getCommentVotes(req: Request, res: Response) {
    const commentVotes = await CommentVote.find({})
    res.json(commentVotes)
}

export async function createCommentVote(req: Request, res: Response) {
    const commentVotes = await CommentVote.find({})
    const commentVoteId = commentVotes.length === 0 ? 1 : commentVotes[commentVotes.length - 1].commentVoteId + 1
    const incomingVote = req.body
    const commentVote = await CommentVote.create({ ...incomingVote, commentVoteId: commentVoteId })
    res.status(200).json({ success: true })
}

export async function getNestedCommentVotes(req: Request, res: Response) {
    const nestedCommentVotes = await NestedCommentVote.find({})
    res.json(nestedCommentVotes)
}

export async function createNestedCommentVote(req: Request, res: Response) {
    const nestedCommentVotes = await NestedCommentVote.find({})
    const nestedCommentVoteId = nestedCommentVotes.length === 0 ? 1 : nestedCommentVotes[nestedCommentVotes.length - 1].nestedCommentVoteId + 1
    const incomingVote = req.body
    const nestedCommentVote = await NestedCommentVote.create({ ...incomingVote, nestedCommentVoteId: nestedCommentVoteId })
    res.status(200).json({ success: true })
}

export async function updatePost(req: Request, res: Response) {
    const postId = parseInt(req.params.postId)
    const incomingPost = req.body;
    const updatedPost = await Post.findOneAndUpdate(
        { postId: postId },
        incomingPost,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function updateComment(req: Request, res: Response) {
    const commentId = parseInt(req.params.commentId)
    const incomingComment = req.body;
    const updatedComment = await Comment.findOneAndUpdate(
        { commentId: commentId },
        incomingComment,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function updateNestedComment(req: Request, res: Response) {
    const nestedCommentId = parseInt(req.params.nestedCommentId)
    const incomingNestedComment = req.body;
    const updatedNestedComment = await NestedComment.findOneAndUpdate(
        { nestedCommentId: nestedCommentId },
        incomingNestedComment,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function updateVote(req: Request, res: Response) {
    const postVoteId = parseInt(req.params.postVoteId)
    const incomingPostVote = req.body;
    const updatedPostVote = await PostVote.findOneAndUpdate(
        { postVoteId: postVoteId },
        incomingPostVote,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function updateCommentVote(req: Request, res: Response) {
    const commentVoteId = parseInt(req.params.commentVoteId)
    const incomingCommentVote = req.body;
    const updatedCommentVote = await CommentVote.findOneAndUpdate(
        { commentVoteId: commentVoteId },
        incomingCommentVote,
        { new: true }
    );
    res.status(200).json({ success: true });
}

export async function updateNestedCommentVote(req: Request, res: Response) {
    const nestedCommentVoteId = parseInt(req.params.nestedCommentVoteId)
    const incomingNestedCommentVote = req.body;
    const updatedNestedCommentVote = await NestedCommentVote.findOneAndUpdate(
        { nestedCommentVoteId: nestedCommentVoteId },
        incomingNestedCommentVote,
        { new: true }
    );
    res.status(200).json({ success: true });
}

