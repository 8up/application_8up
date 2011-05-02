$(document).ready(function () {
	$(".field").each(function(index, field) {
		attach_field_handlers($(field)) });

	$(".field").droppable({
		drop: function(event, ui){
			update(event,ui, this.id.split('_').pop());
		}
	});

});
//Uppdaterar fältens grannar efter vi fått svar från servern efter resize
function update_fields(response_data) {
    //response data är ett json-objekt med field-id som attribut 
    //och nya neighbour-maps som värden
    var neighbours_map = response_data["neighbours_map"];
    for (var field_id in neighbours_map) {
	var field = $(("#field_" + field_id));
	var neighbours = neighbours_map[field_id];
	field.data('neighbours', neighbours);
    }
};

// Nya fields kommer köra denna funktion för att attach:a 
//hanterare till events, lägg till dem här
function attach_field_handlers(field) {
    field.resize8up();
};


function update(event, ui, field_id){
	var note_data = {}
	var src_field = $(event.srcElement.parentElement);
	var dest_field = $(event.target);
	
	var start_page_x = ui.draggable.data('startPageX');
	var start_page_y = ui.draggable.data('startPageY');	
	var diff_left =  event.pageX - start_page_x;
	var diff_top =  event.pageY - start_page_y;

	var start_left = ui.draggable.data('startLeft');
	var start_top = ui.draggable.data('startTop');
	var dest_left = dest_field.offset().left;
	var dest_top = dest_field.offset().top;
	var src_left = src_field.offset().left;
	var src_top = src_field.offset().top;
	
	note_data["position_x"] = (src_left + start_left) + diff_left - dest_left;
	note_data["position_y"] = (src_top + start_top) + diff_top - dest_top;
	
	note_data["field_id"] = field_id;
 	id = ui.helper.context.id.split('_').pop();
	$.ajax({ url: '/notes/' + id + ".json", 
	type: 'PUT', 
	data: {
		note:note_data
	},
  success: function(data, textStatus, jqXHR) {
    update_note(data);
		}
	});	
}


//returnerar den riktning som en handle-event har utförts på genom
// att helt enkelt kolla handtagets klass
function field_handle_direction(handle) {
    var direction = null;
    
    if ($(handle).hasClass("resizable8up-n")) {
	    direction = "north";
	}
    else if ($(handle).hasClass("resizable8up-s")) {
	    direction = "south";
	}
    else if ($(handle).hasClass("resizable8up-e")) {
	    direction = "east";
	}
    else if ($(handle).hasClass("resizable8up-w")) {
	    direction = "west";
	}
    return direction;
};
