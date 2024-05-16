{
    const createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    // console.log(data);
                    let newPost = newPostDom(data.data.post, data.data.user);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                    new ToggleLike($('.toggle-like-button', newPost));
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        });
    }

    //Fetch the post data in DOM
    let newPostDom = function(post, user){
        return $(`<li id="post-${post._id}">
        <div>
            <div class="post-item-wrapper">
                <p class="content">${ post.content }</p>
                <a class="delete-post-button" href="/posts/delete/${post._id}"><i class="fa fa-trash text-danger" aria-hidden="true"></i></a>
                <div class="post-details">
                    <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                        <span>0</span> Likes
                    </a>
                    <p class="user-name">Author: ${ user.name }</p>
                </div>
            </div>
        </div>
        <div class="post-comments">
        
            <form id="new-comment-form" action="/comments/create" method="POST">
                <input type="text" name="content" placeholder="Type here to add comment..." required>
                <input type="hidden" name="post" value="${ post._id }">
                <input type="submit" value="Add Comment">
            </form>
                
    
            <div class="post-comments-list">
                <ul id="post_comments_${ post._id }">
                </ul>
            </div>
    
            
        </div>
    </li>`);
    }

    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }
    

    let createComment = function(){
        let newCommentForm = $('#new-comment-form');

        newCommentForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentForm.serialize(),
                success: function(data, user){
                    // console.log(data, user);
                    let newComment = createCommentDom(data.data.comment, data.data.user);
                    $(`#post_comments_${ data.data.comment.post }`).prepend(newComment);
                    deleteComment(' .delete-comment-button', newComment);
                    new ToggleLike($('.toggle-like-button', newComment));
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })

    }

    let createCommentDom = function(comment, user){
        return $(`<li id="comment_${ comment._id }">
            <div class="comment">
                <p class="author">
                    ${ user.name }
                </p>
                <p>
                    ${ comment.content }
                </p>
            </div>
            <div class="comment-details">
                <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${ comment._id }&type=Comment">
                    <span>0</span> Likes
                </a>
                <a class="delete-comment-button" href="/comments/delete/${ comment._id }">
                    <i class="fa fa-trash text-danger" aria-hidden="true"></i>
                </a>
            </div>
        </li>`);
    }

    let deleteComment = function(commentLink){
        $(commentLink).click(function(e){
            e.preventDefault();
            
            $.ajax({
                type: 'get',
                url: $(commentLink).prop('href'),
                success: function(data){
                    // console.log(data.data.comment_id);
                    $(`#comment_${data.data.comment_id}`).remove();
                }, error: function(error){
                    console.log(error.responseText)
                }
            })
        })
    }
    
    createComment();
    createPost();
}