function de_select_board(e, caller){
	if(e.target != caller){
		return true;
	};
	$(".selected").removeClass("selected");
	$('#toolbox_header_name').text("Name");
	$('#toolbox_info_created').text(" ");
	$('#toolbox_info_updated').text(" ");
	$('#toolbox_info_owner').text(" ");
	$('#toolbox_info_name').text(" ");
}

$(document).ready(function(){
	$("#boards_container").click(function(e){
		de_select_board(e, this);
	});
  $("#boards_container li").click(function(e){
    //Funktion för att hämta data via json.
    //Input, id på det markerade objectet.
    getData = function(id){
      $.ajax({
        url:'/boards/' + id + '.json',
        type: 'GET',
        success: function(data, textStatus, jqXHR){
          //If-sats för att begränsa antalet utskrivna tecken, pga platsbrist i toolbox.
          if((data.board.name).length > 8) {
            toolbox_board_name.text((data.board.name).substring(8,0) + "...");
          } else {
            toolbox_board_name.text(data.board.name);
          }
          toolbox_board_info_created.text("Created: " + data.board.created_at);
          toolbox_board_info_updated.text("Updated: " + data.board.updated_at);
          toolbox_board_info_owner.text("Owner: " + data.board.owner_id);
          
        }
      }
      )};
      //Skapar eller tar bort klassen selected från objektet.
      $(e.target).toggleClass("selected");
      //Hämtar id från ett objekt på klient sidan.
      var id = $(e.target).id8Up();
      //Variabler för olika fält i text arean i toolbox.
      var toolbox_board_name = $('#toolbox_header_name');
      var toolbox_board_info_created = $('#toolbox_info_created');
      var toolbox_board_info_updated = $('#toolbox_info_updated');
      var toolbox_board_info_owner = $('#toolbox_info_owner');
      var toolbox_board_info_name = $('#toolbox_info_name');
      
      //If-sats för att vissa olika information i toolbox beroende på hur många objekt som är markerade.
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
        //Loop-funktion för att hämta ut namnen på de markerade objekten.
        toolbox_board_info_name.text($(".selected").each(function(){
           //If-sats för att begränsa antalet utskrivna tecken, pga platsbrist i toolbox. 
          if(($(this).text()).length > 13) {
            toolbox_board_info_name.append(($(this).text()).substring(13,0) + "..." + "<br>")
          } else {
            toolbox_board_info_name.append($(this).text() + "<br>")
          }
        }
      )
    )
    
    toolbox_board_info_created.text(" ");
    toolbox_board_info_updated.text(" ");
    toolbox_board_info_owner.text(" ");
  }
  
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


