$(document).ready(function() {
	$(".resizable8up-handle").mousedown(field_resize_handle);
    });

function field_resize_handle(event) {
    //Ta reda på åt vilket håll resize:en är på väg.
    var direction = null;
    if ($(event.target).hasClass("resizable8up-n")) {
	    direction = "north";
	}
    else if ($(event.target).hasClass("resizable8up-s")) {
	    direction = "south";
	}
    else if ($(event.target).hasClass("resizable8up-e")) {
	    direction = "east";
	}
    else if ($(event.target).hasClass("resizable8up-w")) {
	    direction = "west";
	}
    
    return direction;    
}