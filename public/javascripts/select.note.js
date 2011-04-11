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

			getData = function(e){
				var id = $(e.target).attr('id').split('_').pop();
				var board_id = $(e.target).data('board_id').split('_').pop();	
				$.ajax({ 
					url: '/boards/' + board_id + '/notes/' + id + '.json', 
					type: 'GET',
					success: function(data, textStatus, jqXHR){
						toolbox_note_name.text(data.note.header);
					}
				}
			)
		};

		getData(e);	

	});

});