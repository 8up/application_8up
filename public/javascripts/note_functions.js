$(document).ready(function () {
    $('#red, #green, #yellow, #blue, #orange, #pink, #original, #crimson, #fuchsia').click(function(e) {
     var x = $(e.target).attr('bgcolor');
    
    $(".selected.note").each(function(index, domElement){
        var note_id = $(domElement).attr('id').split('_').pop();
        var board_id = $(domElement).data('board_id').split('_').pop();
				var url_path =  "/boards/" + board_id + "/notes/" + note_id + '.json';
  
        $.ajax({ url: url_path, 
		    type: 'POST',
        data: {_method:'PUT',
		    'note[color]': x 	},
        success: function(data, textStatus, jqXHR){
          $(domElement).css({'background': x});
            }});   
    });
  });
    
    
    $('#avatar').click(function(e) {
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
          
          }}); 
    
    
    })});
  
  
  
	$("div.field").dblclick(function(e){
		if (e.target != this) {
		    return true;
		}
		create_note(e);
  });

	//Dubbelklick på en lapps header gör att man kan redigera den
	$("div.note h1").dblclick(function(e) {
		if (e.target != this) {
		    return true;
		}
		edit_note_header(e.target);
	});
  
  $(".note").draggable({
		start: function(event, ui){
			$(this).data('startPageX', event.pageX);
			$(this).data('startPageY', event.pageY);
			$(this).data('startLeft', $(this).position().left);
			$(this).data('startTop', $(this).position().top);
		}
	});
      
});

function edit_note_header(header) {
    var original_text = $(header).html();
    var title_form = $("<form></form>");
    var title_input = $("<input type='text' size='10'></input>");
    //Titeln trimmas för tillfället 
    title_input.val($.trim(original_text));
    var note_id = $(header).closest("div.note").id8Up();
    var event_map = {"id" : note_id, "form_object":title_form};
    
    title_form.append(title_input);
    $(header).replaceWith(title_form);
    title_input.focus();
    
    title_input.blur(function(e) { $(this).closest("form").submit(); });

    title_form.submit(event_map, function(e) { 
	    var new_header_text = this.firstChild.value;
	    var target_url = "/notes/" + event_map["id"] + ".json";
	    $.ajax({url: target_url, 
			type: "PUT", 
			data: {id: event_map["id"], note : 
			{header : new_header_text}}, 
			success: function(data) {
			
			var header_text = data.note.header;
			var header = $('<h1></h1>');
			header.html(header_text);
			header.dblclick(function(e) {
				edit_note_header(e.target);
				    });
			event_map["form_object"].replaceWith(header);
		    }
		});
		$("#toolbox_container").trigger("update");
	    return false; //ladda inte om sidan
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
		'note[header]': 'New Header',
		    'note[body]': 'New Body',
		    'note[position_x]': posX,
		    'note[position_y]': posY,
		    'note[owner_id]':1,
		    'note[field_id]': field_id}, 
		success: function(data, textStatus, jqXHR) {
		var header = $('<h1></h1>');
		var note = $('<div></div>');
		note.attr('id', 'note_' + data.note.id);
		note.addClass('note');
		note.addClass('selected');
		note.data('board_id', 'board_' + data.note.board_id);
		note.css({'position': 'absolute', 'top' :  posY + 'px', 'left' : posX + 'px'});
			   
		header.html(data.note.header);
			    
		attach_handlers(note, data);
		note.append(header);
		$(e.target).append(note);
		edit_note_header(header);
		$("#toolbox_container").trigger("update");
	    }
    });
};

function attach_handlers(note, note_data) {
    note.draggable({
		start: function(event, ui){
			note.data('startPageX', event.pageX);
			note.data('startPageY', event.pageY);
			note.data('startLeft', note.position().left);
			note.data('startTop', note.position().top);
		}
});
    note.dblclick(function (e){
	    note_box(e);
	});
    note.click(function (e) {
	    select(e, this);
	}); 
};

function update_note(data){
//	alert("hej");
	var note_id = "note_" + data.note.id;
	var field_id = "field_" + data.note.field_id;
	var note = $('#' + note_id).detach();
	$('#' + field_id).append(note);
	note.css("left", data.note.position_x).css("top", data.note.position_y);
	
}