$(document).ready(function () {
  var myNicEditor = new nicEditor();
  window.noteEditor = myNicEditor;
      $("div.field").live('dblclick', function(e){
        if (e.target != this) {
          return true;
        }
        create_note(e);
      });

      //klick på en lapps header gör att man kan redigera den
      $(".toolbox_button_edit").live('click',function(e) {
	
		    if($(".selected").length == 1){
			    edit_note_header($(".selected").children(".note_header"));
			    //Bara en note som är markerad, edit är möjlig
		    }else{
			    //edit är inte möjlig
		    }
      });

      $(".note").draggable();

    });
    
    function edit_note_header(header) {
      
      var header = $(header);
      var text_area = $("<textarea id='' class='note_header'></textarea>");
      text_area.text(header.text());
      text_area.attr("id", header.attr('id'));
      var parent = header.parent();
      
      header.replaceWith(text_area);
      
      text_area.keydown(function(e){
        if(e.keyCode == 46){
          e.stopPropagation();
        }else if(e.keyCode == 13 && !e.shiftKey){
          e.stopPropagation();
          e.preventDefault();
          de_select_element(header.parent());
          parent.trigger('deselect');
        }
      })
      var note_id = $(text_area).closest("div.note").id8Up();

      text_area.focus();
      text_area.parent().draggable('disable');
      var target_url = "/notes/" + note_id + ".json";

      parent.one('deselect', function(e){
        text_area.blur();
        $.ajax({url: target_url, 
          type: "PUT", 
          data: {'id': note_id, 
          'note' : {'header' : text_area.val()}
        }, 
        success: function(data) {

          header.text(data.note.header);
          text_area.detach();
          parent.append(header);
        }
      });
      $("#toolbox_container").trigger("update");
      
      parent.draggable('enable');
      //header.blur();
    });
  };

  function create_note(e) {
    var field = $(e.target);
    var field_id = $(e.target).attr('id').split('_').pop();
    var posX, posY;
    posX = e.pageX - field.offset().left;
    posY = e.pageY - field.offset().top;

    $.ajax({ url: '/notes', 
    type: 'POST', 
    data: {
      'note[header]': '',
      'note[body]': '--!--',
      'note[position_x]': posX,
      'note[position_y]': posY,
      'note[field_id]': field_id,
      'note[color]': '/images/postit_yellow.png'
    }, 
    success: function(data, textStatus, jqXHR) {
      create_note_at_dom(data, $(e.target), true);
    }
  });
};

function attach_handlers(note, note_data) {
  note.draggable();
};

function change_field_note(data){
  //	alert("hej");
  var note_id = "note_" + data.note.id;
  var field_id = "field_" + data.note.field_id;
  var note = $('#' + note_id).detach();
  $('#' + field_id).append(note);
  note.css("left", data.note.position_x).css("top", data.note.position_y);
}

function update_note(data){
  var note = $('#note_' + data.note.id);
  note.css({
    'top' :  data.note.position_y + 'px', 
    'left' : data.note.position_x + 'px',
    //'background-image': 'url(' + data.note.color + ')'
  });
  note.children('.note_header').html(data.note.header);
  
  var parent_id = '#field_' + data.note.field_id;
  if(note.parent(parent_id).length == 0){
    note.detach();
    $(parent_id).append(note);
  }
  if ("avatar" in data.note) {
      var avatar_owner = data.note.avatar.avatar_owner;
      var avatar_filename = data.note.avatar.avatar_filename;
      var avatar_action = data.note.avatar.avatar_action;
      if (avatar_action == "add") {
	  avatar_add(note, avatar_filename, avatar_owner);
      }
      else {
	  avatar_remove(note, avatar_owner);
      }
  }
}

function create_note_at_dom(data, field, select){
  if($('#note_' + data.note.id).length > 0)
    return;
  var header_id = "note_header_" + data.note.id;
  var header_html = '<div id="'  + header_id + '" class="note_header"></div>' ;
  var header = $(header_html);
  var note = $('<div></div>');
  note.attr('id', 'note_' + data.note.id);
  note.addClass('note');
  
  note.data('board_id', 'board_' + data.note.board_id);
  note.css({
    'position': 'absolute', 
    'top' :  data.note.position_y + 'px', 
    'left' : data.note.position_x + 'px',
    'background-image': 'url(' + data.note.color + ')' 
  });
  var avatar= $('<div></div>');
  avatar.addClass('avatar_holder');
  note.append(avatar);
  header.html(data.note.header);

  attach_handlers(note, data);
  note.append(header);
  field.append(note);
  if(select){
    edit_note_header(header);
    
    window.select(null, note);
    //note.addClass('selected');
    //note.trigger('select');
  }
  $("#toolbox_container").trigger("update");
}

function delete_note(id){
  $('#note_' + id).remove();
  $("#toolbox_container").trigger("update");
}