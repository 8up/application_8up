function select(e, caller) {
	if (e.target != caller) {
		return true;
	};
	$(e.target).toggleClass("selected");
	//colour_change(e.target);
};

$(document).ready(
	function()
	{

		$('.note').click(function(e) 
		{
			select(e, this);

		
			var toolbox_note_name = $('#toolbox_header_name');
			var toolbox_note_info_created = $('#toolbox_info_created');
			var toolbox_note_info_updated = $('#toolbox_info_updated');
			var toolbox_note_info_owner = $('#toolbox_info_owner');
			var toolbox_note_info_name = $('#toolbox_info_name');

			getData = function(e){
				var id = e.id8Up();
				var board_id = e.data('board_id').split('_').pop();	
				$.ajax({ 
					url: '/boards/' + board_id + '/notes/' + id + '.json', 
					type: 'GET',
					success: function(data, textStatus, jqXHR){
						toolbox_note_name.text(data.note.header);
						toolbox_note_info_created.text("Created: " + data.note.created_at);
						toolbox_note_info_updated.text("Updated: " + data.note.updated_at);
						toolbox_note_info_owner.text("Owner: " + data.note.owner_id);
						
					}
				}
			)
		};

				if($(".selected").length==1){

					getData($(".selected:eq(0)"));
					toolbox_note_info_name.text(" ");

				}else if($(".selected").length==0){
					toolbox_note_name.text("Name");
					toolbox_note_info_created.text(" ");
					toolbox_note_info_updated.text(" ");
					toolbox_note_info_owner.text(" ");
					toolbox_note_info_name.text(" ");
				}else{
					toolbox_note_info_name.html('');
					toolbox_note_name.text($(".selected").length + " notes  selected");

					toolbox_note_info_name.text($(".selected").each(function(){
						toolbox_note_info_name.append($(this).text() + "<br>")

					}
				)
			)

			toolbox_note_info_created.text(" ");
			toolbox_note_info_updated.text(" ");
			toolbox_note_info_owner.text(" ");
		}

	});

});