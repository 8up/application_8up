function activate_merge(event) {
    var possible_merges = get_mergable_handles();
    possible_merges.click(merge_fields);
    possible_merges.addClass("mergable");
    possible_merges.bind("mousedown", stop_resize)
}

function stop_resize() {
    return false;
}

function deactivate_merge(event) {
    $(".mergable").unbind("click", merge_fields);
    $(".mergable").unbind("mousedown", stop_resize);
    $(".mergable").removeClass("mergable");
}

// Returnerar alla handtag som skulle vara merge-bara
function get_mergable_handles() {
    var mergables = $(".resizable8up-handle").filter(function(handle) {
	    var handle = $(this);
	    var field = $(handle).parent();
	    var direction = field_handle_direction(handle);
	    var neighbours = field.data("neighbours")[direction];
	    //Om vi inte har en granne kan vi inte merge:a detta fält
	    if (neighbours.length != 1) {
		return false;
	    }
	    var neighbour_field = $("#field_" + neighbours[0]);
	    var reverse_direction = null;
	    
	    if (direction == "north") reverse_direction = "south";
	    else if (direction == "south") reverse_direction = "north";
	    else if (direction == "west") reverse_direction = "east";
	    else if (direction == "east") reverse_direction = "west";
	    
	    if (neighbour_field.data("neighbours")[reverse_direction].length == 1) {
		return true;
	    }
	    
	    return false;
	});
    return mergables;
}

function merge_fields(event) {
    var handle = $(event.target);
    var field = $(handle).parent();
    var direction = field_handle_direction(handle);
    var neighbours = field.data("neighbours")[direction];
    //Om vi inte har precis en granne kan vi inte merge:a detta fält
    if (neighbours.length != 1) {
	return false;
    }
    var neighbour_field = $("#field_" + neighbours[0]);
    var reverse_direction = null;
	    
    if (direction == "north") reverse_direction = "south";
    else if (direction == "south") reverse_direction = "north";
    else if (direction == "west") reverse_direction = "east";
    else if (direction == "east") reverse_direction = "west";
	    
    if (neighbour_field.data("neighbours")[reverse_direction].length != 1) {
	return true;//fortsätt inte om inte båda fält som skall slås samman har precis en granne
	// borde kolla att de är varandras grannar
    }
    
    //För enkelhetens skulle tar vi alltid bort det lägsta/högra fältet
    var to_keep, to_remove;
    if (direction == "south" || direction == "north") {
	if (field.offset().top > neighbour_field.offset().top) {
	    to_keep = neighbour_field;
	    to_remove = field;
	} 
	else {
	    to_keep = field;
	    to_remove = neighbour_field;
	}
    }
    
    else if (direction == "west" || direction == "east") {
	if (field.offset().left > neighbour_field.offset().left) {
	    to_keep = neighbour_field;
	    to_remove = field;
	} 
	else {
	    to_keep = field;
	    to_remove = neighbour_field;
	}
    }
    
    to_remove.find(".note").each(function(index, note) {
	    note = $(note);
	    var offset = note.offset();
	    note.appendTo(to_keep);
	    note.offset(offset);
	});
	

    if (direction == "south" || direction == "north") {
	to_keep.height(to_keep.height() + to_remove.height());
    }
    else if (direction == "west" || direction == "east") {
	to_keep.width(to_keep.width() + to_remove.width());
    }

    to_remove.remove();

    var board_id, field_id_1, field_id_2, merge_direction;
    field_id_1 = to_keep.id8Up();
    field_id_2 = to_remove.id8Up();
    board_id = window.current_board;
    merge_direction = (direction == "west" || direction == "east") 
	? "horizontal" : "vertical";

    $.ajax({ url: "/boards/" + board_id + "/merge_fields/" + field_id_1, 
		type: "POST", 
		data: {field_to_enlarge : field_id_1, 
		    field_to_delete : field_id_2, 
		    merge_direction : merge_direction } });

    $("#merge_button").tool_deactivate();
}

function merge_field_callback(data) {
    var remaining_id = data.result.remaining.field.id;
    var removed_id = data.result.removed.field.id;
    var remaining_field = $("#field_" + remaining_id);
    var removed_field = $("#field_" + removed_id);

    if (removed_field.length !=0) {
	_.each(removed_field.find(".note"), function(note) {
		note = $(note);
		var offset = note.offset();
		note.appendTo(remaining_field);
		note.offset(offset);
	    });
	removed_field.remove();
    }
    update_fields(data);
};
