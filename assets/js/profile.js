{

    //Delete Profile Picture
    let deleteProfilePic = function(){
        let delProfilePicForm = $('#delete-profile-pic');
        delProfilePicForm.on('click', function(e){
            e.preventDefault();

            $.ajax({
                type: 'POST',
                url: '/users/profile/delete-profile-pic',
                success: function(data){ 
                    $('#profile-picture').prop('src', '/images/avatar.jpg');  
                }, error: function(error){
                    console.log(error.responseText);
                }
            })
        })
    }

    deleteProfilePic();

    $('#avatar-upload').on('change', function(e){
        let imageDest = e.target.value;
        let filename = imageDest.split("\\");
        $('#selected-name').css('display', 'block').html(filename[filename.length - 1]);
    })

}