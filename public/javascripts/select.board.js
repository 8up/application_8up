$(document).ready(function(){
	$("#boards_container li").click(function(e){

		getData = function(id){
			$.ajax({ 
				url:'/boards/' + id + '.json', 
				type: 'GET',
				success: function(data, textStatus, jqXHR){

					toolbox_board_name.text(data.board.name);

				}		
			})

		};


		$(e.target).toggleClass("selected");
		var id = $(e.target).attr('id').split('_').pop();
		var toolbox_board_name = $('#toolbox_board_name');
		var toolbox_board_info = $('#toolbox_info');

		if($(".selected").length==1){

			getData($(".selected")[0].id.split('_')[1]);
		}else if($(".selected").length==0){
			toolbox_board_name.text("Name");
		}else{
			toolbox_board_name.text($(".selected").length + " boards  selected");
		}






		//var board_object = {board: {name: 'Test dboard', updated_at: '2011-04-11 13:44'}};
		//  $("#toolbox_board_name").text(board_object.board.name);

	});
	$(".toolbox_button_delete").click(function(){
		$(".selected.note").map(function(index, domElement) 
		{ 
			var note_id = $(domElement).attr('id').split('_').pop();
			var board_id = $(domElement).data('board_id').split('_').pop();
			var url_path =  "/boards/" + board_id + "/notes/" + note_id;


			$.ajax({url : url_path, type: 'DELETE', method: 'POST'});
		} );
		$(".selected.board_container").map(function(index, domElement) 
		{ 
			var board_id = $(domElement).attr('id').split('_').pop();
			var url_path =  "/boards/" + board_id;


			$.ajax({url : url_path, type: 'DELETE', method: 'POST'});
		} );

		$(".selected").remove();


	});
});


