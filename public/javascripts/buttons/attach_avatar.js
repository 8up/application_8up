function add_avatar() {
    var avatar_img = $("#user_avatar");
    var new_avatar = $("<img src=''/>");
    var avatar_img = $("#user_avatar");
    new_avatar.attr('src', avatar_img.attr('src'));
    new_avatar.addClass('my_avatar')  
      
	$(".selected.note").each(function(index, domElement){
		var avatar_holder = $(domElement).find('.avatar_holder');
		var has_avatar = avatar_holder.children(".my_avatar").length > 0;
		if (!has_avatar) {
		    var note_id = $(domElement).attr('id').split('_').pop();
		    var board_id = $(domElement).data('board_id').split('_').pop();
		    var url_path =  "/boards/" + board_id + "/notes/" + note_id + '.json';
		    avatar_holder.append(new_avatar.clone());

		    $.ajax({ url: url_path,
				type: 'POST',
				data: {_method:'PUT',
				    'avatar_action': "add" 	}
      
			});
		}})

	};

function remove_avatar() {
    $(".selected.note").each(function(index, domElement){
	    var avatar_holder = $(domElement).find('.avatar_holder');
	    var has_avatar = avatar_holder.children(".my_avatar").length > 0;
	    if (has_avatar) {
		avatar_holder.children('.my_avatar').remove();
		var note_id = $(domElement).attr('id').split('_').pop();
		var board_id = $(domElement).data('board_id').split('_').pop();
		var url_path =  "/boards/" + board_id + "/notes/" + note_id + '.json';

		$.ajax({ url: url_path,
			    type: 'POST',
			    data: {_method:'PUT',
				'avatar_action': "remove"}

		    });
	    }})
  
	}