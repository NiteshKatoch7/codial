{let e=function(e){$(".add-friend").on("click",function(e){e.preventDefault();let n=e.target;e=n.getAttribute("data-id");$.ajax({type:"GET",url:"/users/friendship/add-friend/?profile_user="+e,success:function(e){var r;e.added?(n.innerHTML="Remove Friend",console.log(e.friendship.to_user),r=i(e.friendship),console.log(r),$("#friends-container").prepend(r)):(n.innerHTML="Add Friend",$("#friend-"+e.removeFriendid).remove())}})})},i=function(e){return $(`
        <li id="friend-${e.to_user}">
            <a href="/users/profile/${e.to_user}">
                ${e.to_user.name}
            </a>&nbsp;
            <a class="add-friend" data-id="${e.to_user}" href="javascript:">Remove</a>
        </li>`)};e()}