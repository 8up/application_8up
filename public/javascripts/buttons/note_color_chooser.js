function color_palette_handler(e) {
    var palette_color = $(e.target).attr("data-color");
    
    $(".selected.note").each(function(index, note){
	    var note_id = $(note).attr('id').split('_').pop();
	    var board_id = $(note).data('board_id').split('_').pop();
	    var url_path =  "/boards/" + board_id + "/notes/" + 
		note_id + '.json';
	    var old_color = $(note).css('background-color');
	    note_change_color(note, palette_color);
	    $.ajax({ url: url_path, 
			type: 'POST',
			data: {_method:'PUT',
			    'note[color]': palette_color },
			error: function(){
			// Om vi får error sätter vi tillbaka gamla färgen
			//$(note).css('background-color', old_color);

		    }});   
	});
};
