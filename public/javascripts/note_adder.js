$(document).ready(function(){
	$("div.field").dblclick(function(e){
		if (e.target != this) {
		    return true;
		}
		create_note(e);
	    });
	function create_note(e) {
	    var header = "Foo";
	    $(e.target).append(
			    "<div class='note' style='position:absolute; top:" + 
			    e.pageY +"px"+
			    ";left:" + 
			    e.pageX + "px"+  
			    ";'>Foo</div>"
			    );
	}
    });