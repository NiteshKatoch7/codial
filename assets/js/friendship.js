{
    let ToggleFriendship = function(e){
        $('.add-friend').on('click', function(e){
            e.preventDefault();
            
            let self = e.target;
            let friendId = self.getAttribute('data-id');
        
            $.ajax({
                type: 'GET',
                url: `/users/friendship/add-friend/?profile_user=${friendId}`,
                success: function(data){
                    if(data.added){
                        self.innerHTML = 'Remove Friend';
                        //console.log(data.friendship.to_user);
                        let newFriendDom = addFriendToListDom(data.friendship);
                        //console.log(newFriendDom);
                        $('#friends-container').prepend(newFriendDom);
                    }else{
                        self.innerHTML = 'Add Friend';
                        $(`#friend-${data.removeFriendid}`).remove();
                    }
                }
            })
        });
    }

    let addFriendToListDom = function(f){
        return $(`
        <li id="friend-${f.to_user}">
            <a href="/users/profile/${f.to_user}">
                ${f.to_user.name}
            </a>&nbsp;
            <a class="add-friend" data-id="${f.to_user}" href="javascript:">Remove</a>
        </li>`);
    }

    ToggleFriendship();

}

