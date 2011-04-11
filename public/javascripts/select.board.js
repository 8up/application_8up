$(document).ready(function(){
  $("#boards_container li").click(function(e){
		getData = function(id){
			$.ajax({ 
				url:'/boards/' + id + '.json', 
				type: 'GET',
        success: function(data, textStatus, jqXHR){
					toolbox_board_name.text(data.board.name);
          toolbox_board_info_created.text(data.board.created_at);
          toolbox_board_info_updated.text(data.board.updated_at);
          toolbox_board_info_owner.text(data.board.owner_id);

				}		
      })
    };

		$(e.target).toggleClass("selected");
		var id = $(e.target).attr('id').split('_').pop();
		var toolbox_board_name = $('#toolbox_board_name');
		var toolbox_board_info_created = $('#toolbox_info_created');
    var toolbox_board_info_updated = $('#toolbox_info_updated');
    var toolbox_board_info_owner = $('#toolbox_info_owner');
    var toolbox_board_info_name = $('#toolbox_info_name');


		if($(".selected").length==1){

			getData($(".selected:eq(0)").id8Up());
      toolbox_board_info_name.text(" ");
      
		}else if($(".selected").length==0){
			toolbox_board_name.text("Name");
      toolbox_board_info_created.text(" ");
      toolbox_board_info_updated.text(" ");
      toolbox_board_info_owner.text(" ");
      toolbox_board_info_name.text(" ");
		}else{
      toolbox_board_info_name.html('');
			toolbox_board_name.text($(".selected").length + " boards  selected");
      
      toolbox_board_info_name.text($(".selected").each(function(){
      toolbox_board_info_name.append($(this).text() + "<br>")
    
  }
)
  )
            
      toolbox_board_info_created.text(" ");
      toolbox_board_info_updated.text(" ");
      toolbox_board_info_owner.text(" ");
		}

	});
	$(".toolbox_button_delete").click(function(){
		$(".selected.note").map(function(index, domElement) 
		{ 
			var note_id = $(domElement).id8Up();
			var board_id = $(domElement).data('board_id').id8Up();
			var url_path =  "/boards/" + board_id + "/notes/" + note_id;


			$.ajax({url : url_path, type: 'DELETE', method: 'POST'});
		} );
		$(".selected.board_container").map(function(index, domElement) 
		{ 
			var board_id = $(domElement).attr('id').id8Up();
			var url_path =  "/boards/" + board_id;


			$.ajax({url : url_path, type: 'DELETE', method: 'POST'});
		} );

		$(".selected").remove();


	});
});


