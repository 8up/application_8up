$(document).ready(function () {
	$(".field").resizable({
		helper: "ui-resizable-helper",
		    start: function(event,ui) { 
		    resize_direction(event,ui) },
		    stop: function(event, ui) {
		    field_resize_stop(event,ui);
		}
	    });
	$(".field").droppable({
		drop: function(event, ui){
			update(event,ui, this.id.split('_').pop());
		}
	});

});

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
	var	dest_left =	dest_field.position().left;
	var dest_top = dest_field.position().top;
	var src_left = src_field.position().left;
	var src_top = src_field.position().top;
	
	note_data["position_x"] = (src_left + start_left) + diff_left - dest_left;
	note_data["position_y"] = (src_top + start_top) + diff_top - dest_top;
	note_data["field_id"] = field_id;
 	id = ui.helper.context.id.split('_').pop();
	$.ajax({ url: '/notes/' + id + '.json', 
	type: 'PUT', 
	data: {
		note:note_data
	},
		success: function(data, textStatus, jqXHR) {
			update_note(data);
		}
	});	
}

// Nya fields kommer köra denna funktion för att attach:a 
//hanterare till events, lägg till dem här
function attach_field_handlers(field) {
    field.resizable({
	    helper: "ui-resizable-helper",
		start: resize_direction,
		stop: function(event, ui) {
		field_resize_stop(event,ui);
	    } });
};

// Denna funktion är något av ett fulhack för att få 
// reda på åt vilket håll vi drar ett field
function resize_direction(event,ui) {
    var handle = $(event.srcElement);
    var field = handle.closest(".field");
    if (handle.hasClass("ui-resizable-n")) {
	field.data("drag-direction", "north");
    }
    else if (handle.hasClass("ui-resizable-s")) {
	field.data("drag-direction", "south");
    }
    else if (handle.hasClass("ui-resizable-e")) {
	field.data("drag-direction", "east");
    }
    else if (handle.hasClass("ui-resizable-w")) {
	field.data("drag-direction", "west");
    }
};


function field_resize_stop(event, ui) {
    var field = ui.element;
    var direction = field.data("drag-direction");
    var naboer = field.data("neighbours")[direction];
    var neighbour_id = naboer[0];
    var foo = "field_" + neighbour_id;
    var granne = $(document.getElementById(foo)); //konstigt, jquery verkar inte fungera här 
    if (direction == "north") {
	granne.height(granne.height() + ui.originalSize.height - 
		      ui.size.height);
    }
    else if (direction == "south") {
	var delta_y = ui.originalSize.height - ui.size.height;
	granne.height(granne.height() + delta_y);
	granne.offset({top:granne.offset().top - delta_y});
    }
    else if (direction == "east") {	
	var delta_x = ui.originalSize.width - ui.size.width;
	granne.width(granne.width() + delta_x);
	granne.offset({left: granne.offset().left - delta_x});
    }
    else if (direction == "west") {
	var delta_x = ui.originalSize.width - ui.size.width;
	granne.width(granne.width() + delta_x);
    }

};
