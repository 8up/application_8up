note_box = function(){
    $( "#in_focus_image" ).show();
    $( "#black_background" ).show();
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
