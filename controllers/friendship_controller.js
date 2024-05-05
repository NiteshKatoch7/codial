const Friendship = require("../models/friendship");
const User = require("../models/user");

module.exports.addFriend = async(req,res) => {

    try{
        
        let existingFriendship1 = await Friendship.findOne({
            from_user: req.user._id,
            to_user: req.query.profile_user
        });
        
        // let existingFriendship2 = await Friendship.findOne({
        //     from_user: req.query.profile_user,
        //     to_user: req.user._id
        // });

        if (existingFriendship1){
            
            // console.log('Friendship relationship already exists:', existingFriendship1 || existingFriendship2);
            // console.log(existingFriendship1, existingFriendship2);
            let friendship = existingFriendship1 || existingFriendship2;
            let from_user = friendship.from_user;
            let to_user = friendship.to_user;
            let user = await User.findById(from_user);
            if(user){
                user.friendship.pull(friendship._id);
                user.save();

                await Friendship.deleteOne({_id: friendship._id});
    
                if(req.xhr){
                    return res.status(200).json({
                        message: 'Removed from your Friendlist!',
                        added: false,
                        removeFriendid: to_user,
                    })
                }
            }

            return res.redirect('back');
        }else{
            let friendship = await Friendship.create({
                from_user: req.user._id,
                to_user: req.query.profile_user
            });

            friendship = await friendship.populate('to_user').execPopulate();
    
            let user = await User.findById(req.user._id);
            
            if(user){
                user.friendship = friendship._id;
                user.save();

                if(req.xhr){
                    return res.status(200).json({
                        message: 'Added to Friendlist',
                        added: true,
                        friendship: friendship,
                    })
                }
                return res.redirect('back');
            }
        }

    }catch(error){
        console.log('Error while adding friends Relationship: ', error);
    }
}