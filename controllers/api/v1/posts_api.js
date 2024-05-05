const Comment = require("../../../models/comments");
const Post = require("../../../models/post");

module.exports.index = async(req, res)=>{

    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        options: { sort: { createdAt: -1 } },
        populate: {
            path: 'user',
        }
    });

    return res.status(200).json({
        message : "List of posts",
        posts: posts,
    });
}

module.exports.delete = async (req, res) => {

    try{
    
        let post = await Post.findById(req.params.id);

        if(post.user == req.user.id){
            post.remove();
            
            let comment = await Comment.deleteMany({ post: req.params.id });
            
            return res.status(200).json({
                message: "Post And Associated Comments Deleted Sucessfully!"
            });
        }else{
            return res.status(401).json({
                message: "unAuthorised",
            });
        }
        
    }catch(err){
        // console.log('Error', err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
}