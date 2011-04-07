function attach_handlers(note, note_data) {
    note.dblclick(function(e){
	    note_box(e);
	});
    note.click(function(e) {
	    select(e, this);
	}); 
}