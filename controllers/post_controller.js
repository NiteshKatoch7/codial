const Comment = require("../models/comments");
const Post = require("../models/post");
const User = require("../models/user");
const Like = require('../models/like');

module.exports.create = async (req, res) => {

    try{
        
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id,
        }); 

        let userPost = await User.findById(post.user);

        if(req.xhr){
            return res.status(200).json({
                data: {
                    post: post,
                    user: userPost,
                },
                message: "Post created!"
            })
        }
        
        req.flash('success', 'Post Published!');
        return res.redirect('back');

    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return res.redirect('back');
    }
};

module.exports.delete = async (req, res) => {

    try{
    
        let post = await Post.findById(req.params.id);
    
        if(post.user == req.user.id){

            await Like.deleteMany({ likeable: post._id, onModel: "Post"});
            await Like.deleteMany({ likeable: {$in: post.comments}});
            
            post.remove();
    
            let comment = await Comment.deleteMany({ post: req.params.id });

            if(req.xhr){
                return res.status(200).json({
                    data: {
                        post_id: req.params.id,
                    },
                    message: "Post Deleted"
                })
            }
        
            req.flash('success', 'Post Deleted Successfully!');
            return res.redirect('back');
        }else{
        
            req.flash('error', 'You cannot delete this Post');
            return res.redirect('back');
        }
        
    }catch(err){
        // console.log('Error', err);
        req.flash('error', err);
        return;
    }
}