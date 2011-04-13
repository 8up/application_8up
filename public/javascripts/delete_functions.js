$(document).ready(function(){  
    //Delete funktion för att ta bort/lägga boards i papperskorgen.
    $(".toolbox_button_delete").click(delete_selected);
    $('body').keypress(function(event) {
  if (event.which == '100') {
    delete_selected(event);
    }});
  });
  
function delete_selected(e){
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
      
    };