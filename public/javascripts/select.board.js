$(document).ready(function(){
  $("#boards_container li").click(function(e){
      $(e.target).toggleClass("selected");
  });
  $(".toolbox_button_delete").click(function(){
	  $(".selected.note").map(function(index, domElement) 
			     { 
				 var note_id = $(domElement).attr('id').split('_').pop();
				 var board_id = $(domElement).data('board_id').split('_').pop();
				 var url_path =  "/boards/" + board_id + "/notes/" + note_id;
						 
				     
				     $.ajax({url : url_path, type: 'DELETE', method: 'POST'});
			     } );
	  $(".selected").remove();
	  
	
  });
});