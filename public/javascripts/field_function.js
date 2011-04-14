$(document).ready(function () {

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