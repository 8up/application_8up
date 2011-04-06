$(document).ready(function(){
	$(".note").dblclick(function() {});
	$("div.field").dblclick(function(e){
		create_note(e);
	    });
	function create_note(e) {
	    $(".field").append(
			       "<div class='note' style='position:absolute; top:" + e.pageY +";left:" + e.pageX +  ";'>Foo</div>"
			       )
		}
    });