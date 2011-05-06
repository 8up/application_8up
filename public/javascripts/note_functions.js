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
    
    
    function color_palette_handler(e) {
    		var x = $(e.target).attr("data-color");
    
    		$(".selected.note").each(function(index, domElement){
    			var note_id = $(domElement).attr('id').split('_').pop();
    			var board_id = $(domElement).data('board_id').split('_').pop();
    			var url_path =  "/boards/" + board_id + "/notes/" + 
    			    note_id + '.json';
    			var old_color = $(domElement).css('background-color');
    			$(domElement).css('background-image', 'url(\'' + x + '\')');
    			$.ajax({ url: url_path, 
    				    type: 'POST',
    				    data: {_method:'PUT',
    					'note[color]': x.replace('_select', '') 	},
    				    error: function(){
    				    // Om vi får error sätter vi tillbaka gamla färgen
    				    //$(domElement).css('background-color', old_color);

    				}});   
    		    });
    };

    function edit_note_header(header) {
      var header = $(header);
      
      header.keydown(function(e){
        if(e.keyCode == 46){
          e.stopPropagation();
        }else if(e.keyCode == 13 && !e.shiftKey){
          e.stopPropagation();
          e.preventDefault();
          de_select_element(header.parent());
          header.parent().trigger('deselect');
        }
      })

      var editor = nicEditors.findEditor($(header).attr('id'));
      
      if( editor == null){
        noteEditor.addInstance($(header).attr('id'));
        editor = nicEditors.findEditor($(header).attr('id'));
      }
      var note_id = $(header).closest("div.note").id8Up();

      header.focus();
      header.parent().draggable('disable');
      var target_url = "/notes/" + note_id + ".json";

      header.parent().one('deselect', function(e){
        var raw_content = editor.getContent();
        var content = $('<div></div>').append(raw_content);
        
       /* if(content.text().length == 0){
          content.text('Empty header')
        }*/
        
        $.ajax({url: target_url, 
          type: "PUT", 
          data: {'id': note_id, 
          'note' : {'header' : content.html()}
        }, 
        success: function(data) {

          var header_text = data.note.header;
          //header.html(header_text);
          editor.setContent(header_text);
          //header.parent().dblclick(function(e) {
        //    edit_note_header(e.target);
          //});
        }
      });
      $("#toolbox_container").trigger("update");
      header.parent().draggable('enable');
      header.blur();
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