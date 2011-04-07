function attach_handlers(note, note_data) {
    note.dblclick(function(note_data){
	    note_box(note.id);
	});
    note.click(function(e) {
	    select(e, this);
	}); 
}