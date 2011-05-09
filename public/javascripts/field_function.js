

$(document).ready(function () {
	$(".field").each(function(index, field) {
		attach_field_handlers($(field)) });
});

function get_neighbours(field, direction) {
    return $(field).data("neighbours")[direction];
}
//Uppdaterar fältens grannar efter vi fått svar från servern efter resize
function update_fields(data) {
    _.each(data.fields, function(field) {
	    field = field.field;
	    window.console.log(field);
	    var $field = $(("#field_" + field.id));
	    $field.data('neighbours', field.neighbours);
	    $field.css({
		    'height': field.height,
			'width': field.width,
			'top': field.position_y,
			'left': field.position_x
                        });
	});
};

// Nya fields kommer köra denna funktion för att attach:a 
//hanterare till events, lägg till dem här
function attach_field_handlers(field) {
    field.resize8up();
    field.droppable({
  		drop: function(event, ui){
  			update(event,ui, this.id.split('_').pop());
  			$(this).removeClass('highlight');
  		},
  		over: function(event, ui){
  		  $(this).addClass('highlight');
  		},
  		out: function(event, ui){
		    $(this).removeClass('highlight');
		  }
  	});
};


function update(event, ui, field_id){
	var note_data = {}
	var dest_field = $(event.target);
	          
	
  note_data["position_x"] = ui.offset.left - dest_field.offset().left;
  note_data["position_y"] = ui.offset.top - dest_field.offset().top;
	
	note_data["field_id"] = field_id;
 	id = ui.helper.context.id.split('_').pop();
	$.ajax({ url: '/notes/' + id + ".json", 
	type: 'PUT', 
	data: {
		note:note_data
	},
  success: function(data, textStatus, jqXHR) {
      change_field_note(data);
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

