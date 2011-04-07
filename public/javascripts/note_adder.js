$(document).ready(function(){
	$("div.field").dblclick(function(e){
		if (e.target != this) {
		    return true;
		}
		create_note(e);
	    });
	function create_note(e) {
	    var field_id = $(e.target).attr('id').split('_').pop()
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
			   
			    note.addClass('note');
			    note.css({'position': 'absolute', 'top' : e.pageY + 'px', 'left' : e.pageX + 'px'});
			    header.html(data.note.header);
			   
			    note.append(header);

			    note.dblclick(function(){
					    note_box(data.note.id);
				});
			    // note.mousedown(function(e) {
			    // 	    dragnote(e);
			    //		});
			    $(e.target).append(note);
				    
			}
		    }
		    );
	}
    });