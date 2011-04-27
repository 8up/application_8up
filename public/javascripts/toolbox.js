$(document).ready(
  function(){
      //Atach a handler for when the user presses the split horizontaly button
	$("#split_horiz").click(function(){
		//Om vi inte redan satt flaggan, eller den är åt andra hållet,
		//sätter vi den horizontellt
		if ($("#split_button_table").data("split_direction") == "none" || 
		    $("#split_button_table").data("split_direction") == "vertical") 
		    {
			//Vi använder en klass för att styla knappen som nedtryckt
			$("#split_horiz").addClass("depressed"); 
			$("#split_button_table").data("split_direction", 
						      "horizontal"); 
			set_split();
		    }
		//Om vi redan inlett det ångrar ett till klick
		else if ($("#split_button_table").data("split_direction") 
			 == "horizontal") {
		    reset_split();
		}
		//Annars gör vi inget
	    });

	$("#split_vert").click(function(){
//Om vi inte redan satt flaggan, eller den är åt andra hållet,
		//sätter vi den horizontellt
		if ($("#split_button_table").data("split_direction") == "none" || 
		    $("#split_button_table").data("split_direction") == "horizontal") 
		    {
			//Vi använder en klass för att styla knappen som nedtryckt
			$("#split_vert").addClass("depressed"); 
			$("#split_button_table").data("split_direction", 
						      "vertical"); 
			set_split();
		    }
		//Om vi redan inlett det ångrar ett till klick
		else if ($("#split_button_table").data("split_direction") 
			 == "vertical") {
		    reset_split();
		}
		//Annars gör vi inget
	    });
	
    $("#toolbox_container").bind('update',function(){
      //Eftersom någon har ändrat
      //Variabler för olika textfält i toolbox.
      var toolbox_name = $('#toolbox_header_name');
      var toolbox_info_created = $('#toolbox_info_created');
      var toolbox_info_updated = $('#toolbox_info_updated');
      var toolbox_info_owner = $('#toolbox_info_owner');
      var toolbox_info_name = $('#toolbox_info_name');
      
      //Funktion för att hämta information via json om objektet.
      getData = function(e){
        if($(e).hasClass("note")) {
          id = e.id8Up();
          var board_id = e.data('board_id').split('_').pop();
          $.ajax({
            url: '/boards/' + board_id + '/notes/' + id + '.json',
            type: 'GET',
            success: function(data, textStatus, jqXHR){
              if((data.note.header).length > 8){
                toolbox_name.text((data.note.header).substring(7,0) + "...");
              } else {
                toolbox_name.text(data.note.header);
              }
              toolbox_info_created.text("Created: " + data.note.created_at);
              toolbox_info_updated.text("Updated: " + data.note.updated_at);
              toolbox_info_owner.text("Owner: " + data.note.owner_id);
              
            }
          }
        )
      } else {
        id = $(e).id8Up();
        $.ajax({
          url:'/boards/' + id + '.json',
          type: 'GET',
          success: function(data, textStatus, jqXHR){
            //If-sats för att begränsa antalet utskrivna tecken, pga platsbrist i toolbox.
            if((data.board.name).length > 8) {
              toolbox_name.text((data.board.name).substring(8,0) + "...");
            } else {
              toolbox_name.text(data.board.name);
            }
            toolbox_info_created.text("Created: " + data.board.created_at);
            toolbox_info_updated.text("Updated: " + data.board.updated_at);
            toolbox_info_owner.text("Owner: " + data.board.owner_name);
            
          }
        }
      )
    }
  };
  
  //If-sats för att vissa olika information i toolbox beroende på hur många objekt som är markerade.
  if($(".selected").length==1){
    getData($(".selected:eq(0)"));
    toolbox_info_name.text(" ");
    
  }else if($(".selected").length==0){
    toolbox_name.text("Name");
    toolbox_info_created.text(" ");
    toolbox_info_updated.text(" ");
    toolbox_info_owner.text(" ");
    toolbox_info_name.text(" ");
    
  }else{
    toolbox_info_name.html('');
    toolbox_name.text($(".selected").length + " notes  selected");
    //Loop-funktion för att hämta ut namnen på de markerade objekten.
    toolbox_info_name.text($(".selected").each(function(){
      if(($(this).text().trim()).length > 11){
        toolbox_info_name.append(($(this).text().trim()).substring(10,0) + "..." + "<br>")
      } else {
        toolbox_info_name.append($(this).text() + "<br>");
      }
      
    }
  )
)

toolbox_info_created.text(" ");
toolbox_info_updated.text(" ");
toolbox_info_owner.text(" ");
}

})

});