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
    resize_helper.removeAttr("id"); 
    resize_helper.css("position","absolute");
    resize_helper.empty();
    resize_helper.addClass("resizable8up-helper");
 
    // Lägg till helpern i board-diven
    $(event.target).closest(".board_div").prepend(resize_helper);
    
    resize_helper.show();

    //Lägg till en funktion som ändrar storleken på 
    //helpern när användaren rör musen 
    $(document).mousemove( resize_mousemove_handler = function(event) {
	    if (direction == "north") {
		resize_helper.offset({"top" : Math.ceil(event.pageY)});
		
		resize_helper.height(srcField.offset().top + 
				     srcField.height() - Math.ceil(event.pageY));
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
    $(document).mouseup(resize_mouseup_handler = function(event) {
	    resize_field(resize_helper, srcField, direction);
	    resize_helper.remove();
	    $(document).unbind("mousemove",resize_mousemove_handler);
	    $(document).unbind("mouseup", resize_mouseup_handler);
	    return true;
	});
     
    return direction;
};

// Utför själva resizen på fältet som skall ändras
function resize_field(resize_helper, srcField, direction) {
    var delta = 0;
    var field_id = srcField.id8Up();
    var board_id = $(srcField.parent()).id8Up();
   

    if (direction == "south") {
	delta = resize_helper.height() - srcField.height();
	srcField.height(srcField.height() + delta);
	
    }
    else if (direction == "north") {
	delta = Math.round(resize_helper.offset().top - srcField.offset().top);
	var src_height_str = srcField[0].style.height;
	var alpha_index = src_height_str.search("[A-z]"); 
	var src_height = 1 * src_height_str.substring(0, alpha_index);
	var new_height = src_height - delta;
	var new_top = srcField.offset().top + delta;
	srcField[0].style.height = new_height + "px";
	srcField.offset({top: new_top});
    }
    else if (direction == "west") {
	delta = Math.round(resize_helper.offset().left - srcField.offset().left);
	
    }
    else if (direction == "east") {
	delta = resize_helper.width() - srcField.width();
	srcField.width(srcField.width() + delta);
    }
    
    $.ajax({url: "/boards/" + board_id + "/resize_field/" + field_id,
		type:"POST",
		data: {"direction": direction, "delta":delta} });
};