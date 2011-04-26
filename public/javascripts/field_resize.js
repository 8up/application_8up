$(document).ready(function() {
	$(".resizable8up-handle").mousedown(field_resize_handle);
    });

function field_resize_handle(event) {
    //Ta reda på åt vilket håll resize:en är på väg.
    var direction = field_handle_direction(event.target);
    
    //Skapa nytt helper-objekt som visar resizen
    var srcField = $(event.target).closest(".field");
    var resize_helper = srcField.clone();
    resize_helper.removeClass();
    resize_helper.data("srcField", srcField);
    resize_helper.removeAttr("id"); 
    resize_helper.css("position","absolute");
    resize_helper.html('');
    resize_helper.addClass("resizable8up-helper");
 
    // Lägg till helpern i board-divven
    $(event.target).closest(".board_div").prepend(resize_helper);
    
    resize_helper.show();

    //Lägg till en funktion som ändrar storleken på 
    //helpern när användaren rör musen 
    $(document).mousemove( helper_resize = function(event) {
	    if (direction == "north") {
		resize_helper.offset({"top" : event.pageY});
		
		resize_helper.height(srcField.offset().top + 
				    srcField.height() - event.pageY);
	    }
	    else if (direction == "west") {
		resize_helper.offset({"left" : event.pageX});
		
		resize_helper.width(srcField.offset().left + 
				    srcField.width() - event.pageX);
	    }
	    else if (direction == "east"){
		resize_helper.width(event.pageX - srcField.offset().left);
	    }
	    else if (direction == "south") {
		resize_helper.height(event.pageY - srcField.offset().top);
	    }
	    
	
	});

    // En eventhandler som lyssnar på mouseup, dvs när användaren avslutar 
    // drag-rörelsen
    $(document).mouseup(function(event) {
	    resize_helper.remove();
	    $(document).unbind("mousemove",helper_resize);
	});
     
    return direction;
}