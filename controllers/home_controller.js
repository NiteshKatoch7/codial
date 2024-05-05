const Post = require("../models/post");
const User = require("../models/user");

module.exports.home = async function(req, res){

    try{

        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'user',
            }
        })
        .populate({
            path: 'likes'
        });
    
        let users = await User.find({});
        let user = await User.findById(req.user._id).populate({
            path: 'friendship',
            populate: {
                path: 'to_user',
            }
        });
            
        return res.render('home', {
            title: "Home",
            posts: posts,
            all_users: users,
            friends: user.friendship,
        }); 

    }catch(err){
        console.log('Error while generating home', err);
        return;
    }
}

// module.exports.actionName = function(req, res){}