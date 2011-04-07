note_box = function(e){
    var id = $(e.target).attr('id').split('_').pop()
    $( "#in_focus_image" ).show();
    $( "#black_background" ).show();
    $.ajax({ 
	url: 'notes/' + id + '/content.json', 
	type: 'GET',
	success: function(data, textStatus, jqXHR){
      var note_body = $('#note_body');
      note_body.text(data.note.body);
    }});
};
$(document).ready(function(){
	$( "div.note" ).dblclick(function(e){
		note_box(e);
	    });
				  
	$( "#black_background" ).click(function(){
		$( "#in_focus_image" ).hide();
		$( "#black_background" ).hide();
												 
	    });
    });
