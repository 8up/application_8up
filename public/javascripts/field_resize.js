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
    var resize_map = get_resize_map(srcField, direction);   

    if (direction == "south") {
	delta = resize_helper.height() - srcField.height();
	//Ändra storlek på alla på samma sida som det fält som förändrades
	for (var i=0; i < resize_map["original_side"].length; i++) {
	    var current_field = $(("#field_" + resize_map["original_side"][i]));
	    current_field.height(current_field.height() + delta);
	}
	//Ändra storlek på fälten på andra sidan
	for (var i=0; i < resize_map["other_side"].length; i++) {
	    var current_field = $(("#field_" + resize_map["other_side"][i]));
	    current_field.height(current_field.height() - delta);
	    current_field.offset({top: current_field.offset().top +delta});
	}

    }
    else if (direction == "north") {
	delta = Math.round(resize_helper.offset().top - srcField.offset().top);

	//Ändra storlek på alla på samma sida som det fält som förändrades
	for (var i=0; i < resize_map["original_side"].length; i++) {
	    var current_field = $(("#field_" + resize_map["original_side"][i]));
	   
	    var new_top = current_field.offset().top + delta;
	    current_field.offset({top: new_top});
	    current_field.height(current_field.height() - delta);

	}
	//Ändra storlek på fälten på andra sidan
	for (var i=0; i < resize_map["other_side"].length; i++) {
	      var current_field = $(("#field_" + resize_map["other_side"][i]));
	      current_field.height(current_field.height() + delta);
	}

    }
    else if (direction == "west") {
	delta = Math.round(resize_helper.offset().left - srcField.offset().left);

	//Ändra storlek på alla på samma sida som det fält som förändrades
	for (var i=0; i < resize_map["original_side"].length; i++) {
	    var current_field = $(("#field_" + resize_map["original_side"][i]));

	    var new_width = current_field.offset().left + delta;
	    current_field.offset({left: new_width});
	    current_field.width(current_field.width() - delta);
	}
	//Ändra storlek på fälten på andra sidan
	for (var i=0; i < resize_map["other_side"].length; i++) {
	    var current_field = $(("#field_" + resize_map["other_side"][i]));
	    
	    var new_width = current_field.offset().left + delta;
	    current_field.width(current_field.width() + delta);
	}
    }
    else if (direction == "east") {
	delta = Math.round(resize_helper.width() - srcField.width());

	//Ändra storlek på alla på samma sida som det fält som förändrades
	for (var i=0; i < resize_map["original_side"].length; i++) {
	    var current_field = $(("#field_" + resize_map["original_side"][i]));
	    var new_width = current_field.width() + delta;
	    current_field.width(new_width);
	}
	//Ändra storlek på fälten på andra sidan
	for (var i=0; i < resize_map["other_side"].length; i++) {
	    var current_field = $(("#field_" + resize_map["other_side"][i]));
	    var new_width = current_field.offset().left + delta;
	    current_field.offset({left: new_width});
	    current_field.width(current_field.width() - delta);
	}
    }
    
    $.ajax({url: "/boards/" + board_id + "/resize_field/" + field_id,
		type:"POST",
		data: {"direction": direction, "delta":delta} });
    
};

function get_resize_map(field, direction) {
    var field_id = field.id8Up();
    var reverse_direction = null;
    
    if (direction ==  "north") {
	reverse_direction = "south";
    }
    else if (direction == "east") {
	reverse_direction = "west"                                   
    }                
    else if (direction == "south") {
	reverse_direction = "north";
    }
    else if (direction == "west") {
	reverse_direction = "east";
    }

    //Vi använder objekt för att representera mängder, fult men det fungerar
    var resize_map = {"other_side" : [], "original_side" : []};

    var to_visit = {};
    var visited = {};
    var neighbours = field.data("neighbours")[direction];
    //börja med att lägga till först elementet och alla dess grannar 
    //i den riktning vi skall resiza
    visited[field_id] = field_id;
    to_visit[field_id] = field_id;
    resize_map["original_side"].push(field_id);
    for (var i = 0; i < neighbours.length; i++) {
	to_visit[neighbours[i]] = neighbours[i];
    }
    var current_side = "other_side"; 
    var done = false;
    var current_direction = reverse_direction;
    while (!done) {
	for (current_field_id in to_visit) {
		// Om fältet redan behandlats lägger vi det i visited
		if (current_field_id in visited) {
		    continue;
		};

		var current_field = $(("#field_" + current_field_id));
		neighbours = current_field.data('neighbours')[current_direction];
	
		// Kolla alla grannar till det nuvarande fältet
		for (var i=0; i < neighbours.length; i++) {
		    //om den nuvarande grannen redan finns i 
		    //to_visit skall den inte läggas till
		    if (!(neighbours[i] in to_visit)) {
			to_visit[neighbours[i]] = neighbours[i];
		    }
		}
		
		resize_map[current_side].push(current_field_id);
		visited[current_field_id] = current_field_id;
	    }
	
	current_side = current_side == "other_side" ? 
	    "original_side" : "other_side";
	current_direction = current_direction == direction ? 
	    reverse_direction : direction;
	//Kolla om vi är färdiga. Om alla element i to_visit 
	//också finns i visited är vi färdiga
	done = true;
	for (prop in to_visit) {
		if (!(prop in visited)) {
		    done = false;
		    break;
		} 
	    }
    }

    return resize_map;
};