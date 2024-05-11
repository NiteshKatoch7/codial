{const a=function(){let t=$("#new-post-form");t.submit(function(e){e.preventDefault(),$.ajax({type:"post",url:"/posts/create",data:t.serialize(),success:function(e){e=o(e.data.post,e.data.user);$("#post-list-container>ul").prepend(e),n($(" .delete-post-button",e)),new ToggleLike($(".toggle-like-button",e))},error:function(e){console.log(e.responseText)}})})};let o=function(e,t){return $(`<li id="post-${e._id}">
        <p>
            <small>
                <a class="delete-post-button" href="/posts/delete/${e._id}">Delete</a>
            </small>
            ${e.content}
            ${t.name}
            <br>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Post">
                0 Likes
            </a>
        </p>
        <div class="post-comments">
        
            <form id="new-comment-form" action="/comments/create" method="POST">
                <input type="text" name="content" placeholder="Type here to add comment..." required>
                <input type="hidden" name="post" value="${e._id}">
                <input type="submit" value="Add Comment">
            </form>
                
    
            <div class="post-comments-list">
                <ul id="post_comments_${e._id}">
                </ul>
            </div>
    
            
        </div>
    </li>`)},n=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(e){$("#post-"+e.data.post_id).remove()},error:function(e){console.log(e.responseText)}})})},e=function(){let t=$("#new-comment-form");t.submit(function(e){e.preventDefault(),$.ajax({type:"post",url:"/comments/create",data:t.serialize(),success:function(e,t){var o=s(e.data.comment,e.data.user);$("#post_comments_"+e.data.comment.post).prepend(o),l(" .delete-comment-button",o),new ToggleLike($(".toggle-like-button",o))},error:function(e){console.log(e.responseText)}})})},s=function(e,t){return $(`<li id="comment_${e._id}">
            <p>
                ${e.content}
                <br>
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${e._id}&type=Comment">
                    0 Likes
                </a>
                <br>
                <small>
                    ${t.name}
                </small>

                <small>
                    <a class="delete-comment-button" href="/comments/delete/${e._id}">
                        Delete
                    </a>
                </small>

            </p>
        </li>`)},l=function(t){$(t).click(function(e){e.preventDefault(),$.ajax({type:"get",url:$(t).prop("href"),success:function(e){$("#comment_"+e.data.comment_id).remove()},error:function(e){console.log(e.responseText)}})})};e(),a()}