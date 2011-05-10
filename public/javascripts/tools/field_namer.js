function activate_field_namer(event) {
    $('.field').bind("click", name_field);
}

function deactivate_field_namer(event) {
    $('.field').unbind("click", name_field);
}

function name_field(event) {
    var field = $(this);
    var field_header = field.children("h1");
    if (field_header.length == 0) {
	field_header = $('<h1 class="field_name"></h1>');
	field.append(field_header);
    }
    var text_area = $("<textarea id='' class='field_name'></textarea>");
    text_area.text(field_header.text());
          
    field_header.replaceWith(text_area);
      
    text_area.keydown(function(e){
	    if(e.keyCode == 46){
		e.stopPropagation();
	    }else if(e.keyCode == 13 && !e.shiftKey){
		e.stopPropagation();
		e.preventDefault();
		text_area.blur();
	    }
	});
    
    var field_id = field.id8Up();
    
    text_area.focus();
    text_area.select();
    var target_url = "/fields/" + field_id + ".json";
    
    text_area.bind('blur', function(e){
	    field_header.text(text_area.val());
	    text_area.replaceWith(field_header);
	    $.ajax({url: target_url, 
			type: "PUT", 
			data: {'id': field_id, 
			    'field' : {'name' : text_area.val()}
		}, 
        success: function(data) {
		    /*text_area.replaceWith(header);
		      header.text(data.note.header);*/
          //text_area.unbind('blur'm )
		}
	    });
	
	});

	
    //slutligen
    $('#field_namer').tool_deactivate();
}