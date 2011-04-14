$(document).ready(function () {

	$(".field").droppable({
		drop: function(event, ui){
			var field_id = this.id.split('_').pop();
			update(ui, this.id.split('_').pop());
		}
	});

});

function update(ui, field_id){
	var note_data = {}
	note_data["position_x"] = ui.offset.left;
	note_data["position_y"] = ui.offset.top;
	note_data["field_id"] = field_id;
 	id = ui.helper.context.id.split('_').pop();
	$.ajax({ url: '/notes/' + id, 
	type: 'PUT', 
	data: {
		note:note_data
	},
		success: function(data, textStatus, jqXHR) {

		}
	});	
}

// Nya fields kommer köra denna funktion för att atacha 
//hanterare till events, lägg till dem här
function attach_field_handlers(field) {

}