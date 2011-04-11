$(document).ready(function () {
    $('#red, #green, #yellow, #blue, #orange, #pink').click(function(e) {
    var x = e.target.id;
    
    $(".selected.note").each(function(index, domElement){
        var note_id = $(domElement).attr('id').split('_').pop();
        var board_id = $(domElement).data('board_id').split('_').pop();
				var url_path =  "/boards/" + board_id + "/notes/" + note_id;
  
        $.ajax({ url: url_path, 
		    type: 'POST',
        data: {_method:'PUT',
		    'note[color]': x 	}        
        },
        success: function(data, textStatus, jqXHR){
          $(domElement).css({'background': x});
        }
        );   
    }); 
  }
	$("div.field").dblclick(function(e){
		if (e.target != this) {
		    return true;
		}
		create_note(e);
	});

});

function create_note(e) {
    var field_id = $(e.target).attr('id').split('_').pop();
    $.ajax({ url: '/notes', 
		type: 'POST',
    data: {
		'note[header]': 'Test Head',
		    'note[body]': 'Test body',
		    'note[position_x]': e.pageX,
		    'note[position_y]': e.pageY,
		    'note[owner_id]':1,
		    'note[field_id]': field_id}, 
		success: function(data, textStatus, jqXHR) {
		var header = $('<h1></h1>');
		var note = $('<div></div>');
		note.attr('id', 'note_' + data.note.id);
		note.addClass('note');
		note.data('board_id', 'board_' + data.note.board_id);
		note.css({'position': 'absolute', 'top' :  (e.pageY -50) + 'px', 'left' : (e.pageX-50) + 'px'});
			   
		header.html(data.note.header);
			    
		attach_handlers(note, data);
		note.append(header);
		$(e.target).append(note);
				    
	    }
	});
}

function attach_handlers(note, note_data) {
    note.dblclick(function (e){
	    note_box(e);
	});
    note.click(function (e) {
	    select(e, this);
    }); 

}
