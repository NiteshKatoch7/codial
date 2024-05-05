const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comments");

module.exports.toggleLike = async(req,res) => {
    try{

        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable =  await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user
        })

        if(existingLike){
            likeable.likes.pull(existingLike._id);
            likeable.save();
            existingLike.remove();
            deleted = true;
        }else{
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type,
            });

            likeable.likes.push(newLike._id);
            likeable.save();
        }

        return res.status(200).json({
            message: "Request Successfull",
            deleted: deleted,
        })

    }catch(error){
        console.log('Error to toggle the like: ', error);
        return res.status(500).json({
            message: 'Internal Server Error',
        })
    }
}