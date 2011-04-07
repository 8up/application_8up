$(document).ready(function(){
	$("div.field").dblclick(function(e){
		if (e.target != this) {
		    return true;
		}
		create_note(e);
	    });
	function create_note(e) {
	    var header = "Foo";
	    var note = $('<div></div>');
	    note.addClass('note');
	    note.css({'position': 'absolute', 'top' : e.pageY + 'px', 'left' : e.pageX + 'px'});
	    note.html("Foo");
	    note.dblclick(function(){
		    note_box();
	    });
	    // note.mousedown(function(e) {
	    // 	    dragnote(e);
	    //		});
	    $(e.target).append(note);
	}
    });