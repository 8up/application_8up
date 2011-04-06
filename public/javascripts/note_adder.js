$(document).ready(function(){
	$("div.note").dblclick(function(e) {e.stopPropagation()});
	$("div.field").dblclick(function(e){
		if (e.target != this) {
		    return true;
		}
		create_note(e);
	    });
	function create_note(e) {
	    
	    $(".field").append(
			       "<div class='note' style='position:absolute; top:" + e.pageY +";left:" + e.pageX +  ";'>Foo</div>"
			       )
		}
    });