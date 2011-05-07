function add_avatar() {
    var avatar_img = $("#user_avatar");
      
    $(".selected.note").each(function(index, note){
	    if (avatar_add($(note), avatar_img.attr('src'), window.current_user_name)) {
		var note_id = $(note).attr('id').split('_').pop();
		var board_id = $(note).data('board_id').split('_').pop();
		var url_path =  "/boards/" + board_id + 
		    "/notes/" + note_id + '.json';
		$.ajax({ url: url_path,
			    type: 'POST',
			    data: {_method:'PUT',
				'avatar_action': "add" 	}
		    });
	    }})
	};

function remove_avatar() {
    $(".selected.note").each(function(index, note){

	    if (avatar_remove($(note), window.current_user_name)) {
		var note_id = $(note).attr('id').split('_').pop();
		var board_id = $(note).data('board_id').split('_').pop();
		var url_path =  "/boards/" + board_id + "/notes/" + note_id + '.json';
		$.ajax({ url: url_path,
			    type: 'POST',
			    data: {_method:'PUT',
				'avatar_action': "remove"}

		    });
	    }})
  
	}

function avatar_add(note, avatar_filename, avatar_owner) {
    var avatar_image = note.find('.avatar_image[title=\"' 
				 + avatar_owner + '\"]');
    var has_avatar = avatar_image.length > 0;
    
    if (!has_avatar) {
	var new_avatar = $("<img src=''/>");
	new_avatar.attr('title', avatar_owner);
	new_avatar.attr('src', avatar_filename);
	new_avatar.addClass('avatar_image');
	var avatar_holder = note.find('.avatar_holder');
	avatar_holder.append(new_avatar);
	return true;
    }
    return false;
}

function avatar_remove(note, avatar_owner) {
    var avatar_image = note.find('.avatar_image[title=\"' 
				 + avatar_owner + '\"]');
    var has_avatar = avatar_image.length > 0;
    
    if (has_avatar) {
	avatar_image.remove();
	return true;
    }
    return false;
}