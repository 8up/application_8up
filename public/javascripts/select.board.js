function de_select_board(e, caller){
  if(e.target != caller){
    return true;
  };
  $(".selected").removeClass("selected");
};

function select(e, caller) {
	if (e.target != caller) {
		return true;
	};
	$(e.target).toggleClass("selected");
};


$(document).ready(function(){
  $("#boards_container").click(function(e){
    de_select_board(e, this);
    $("#toolbox_container").trigger("update");
  });
  $("#boards_container li").click(function(e){
    //Skapar eller tar bort klassen selected från objektet.
    select(e,this);
    $("#toolbox_container").trigger("update");
  });
    
    //Delete funktion för att ta bort/lägga boards i papperskorgen.
    $(".toolbox_button_delete").click(function(){
      $(".selected.note").map(function(index, domElement)
      {
        var note_id = $(domElement).id8Up();
        var board_id = $(domElement).data('board_id').split('_').pop();
        var url_path =  "/boards/" + board_id + "/notes/" + note_id;
        
        
        $.ajax({url : url_path, type: 'DELETE', method: 'POST'});
      } );
      $(".selected.board_container").map(function(index, domElement)
      {
        var board_id = $(domElement).id8Up();
        var url_path =  "/boards/" + board_id;
        
        
        $.ajax({url : url_path, type: 'DELETE', method: 'POST'});
      } );
      
      $(".selected").remove();
      $("#toolbox_container").trigger("update");
      
    });
  });
  
  
