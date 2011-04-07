note_box = function(id){
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
	$( "div.note" ).dblclick(function(){
		note_box();
	    });
				  
	$( "#black_background" ).click(function(){
		$( "#in_focus_image" ).hide();
		$( "#black_background" ).hide();
												 
	    });
    });
