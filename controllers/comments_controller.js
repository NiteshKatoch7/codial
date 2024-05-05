const Comment = require("../models/comments");
const Post = require("../models/post");
const User = require("../models/user");
const Like = require("../models/like");
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');

module.exports.create = async(req, res) => {

    try{

        let post = await Post.findById(req.body.post);
    
        if(post){
    
            let comment = await Comment.create({
    
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
    
            });
    
            post.comments.push(comment);
            post.save();

            let commentUser = await User.findById(comment.user);
            comment = await comment.populate('user', 'name, email').execPopulate();
            //commentsMailer.newComment(comment);
            let job = queue.create('emails', comment).save(function(err){
                if(err){
                    console.log("error in creating a queue: ", err);
                    return;
                }

                console.log('job-enqueued', job.id);
            });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment,
                        user: commentUser,
                    },
                    message: "Comment Published!"
                });
            }
        
            req.flash('success', 'Comment Added Successfully!');
            return res.redirect('back');
        }

    }catch(error){
        // console.log('Error', err);
        req.flash('error', err);
        return;
    }
}

module.exports.delete = async(req,res) => {

    try{

        const comment = await Comment.findById(req.params.id);
    
        if(comment.user == req.user.id){
            let postId = comment.post;

            await Like.deleteMany({likeable: comment._id, onModel: 'Comment'});

            comment.remove();
    
            await Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id} });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id,
                    },
                    message: "Comment is deleted!"
                })
            }
        
            req.flash('success', 'Comment Deleted Successfully!');
            return res.redirect('back');
        }

    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return;
    }
}