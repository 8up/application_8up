function attach_avatar(e) {
  var x = $(e.target).attr('src');
  
  $(".selected.note").each(function(index, domElement){
    var avatar_holder = $(domElement).find('.avatar_holder');
    var has_avatar = avatar_holder.children("[name|=my_avatar]").length > 0;
    var note_id = $(domElement).attr('id').split('_').pop();
    var board_id = $(domElement).data('board_id').split('_').pop();
    var url_path =  "/boards/" + board_id + "/notes/" + note_id + '.json';
    if(has_avatar){
      avatar_holder.children("[name|=my_avatar]").remove();
    };
    $.ajax({ url: url_path,
      type: 'POST',
      data: {_method:'PUT',
      'avatar_action': has_avatar ? "remove" : "add" 	},
      success: function(data, textStatus, jqXHR){
        if(has_avatar){
          avatar_holder.children("[name|=my_avatar]").remove();
        }
        else{
          var has_avatar_check = avatar_holder.children("[name|=my_avatar]").length > 0;
          if (!has_avatar_check){
            var new_avatar = $('<img name="my_avatar" src="/images/avatar/' + data.note.avatar + '" width="50%">');
          }
          avatar_holder.append(new_avatar);
          
        }
        
      }
    });
  })
}
