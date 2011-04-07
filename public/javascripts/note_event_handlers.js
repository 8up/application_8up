function attach_handlers(note) {
    note.dblclick(function(){
	    note_box(data.note.id);
	});
    note.click(function(e) {
	    select(e, this);
	}); 
}