$(document).ready(function(){
	$("#toolbox_container").bind('update',function(){
		var context_area = $('#context_area');
		var pathname = window.location.pathname;
		var array = pathname.split("/");

		// Ta bort alla tomma element ur arrayen
		array = array.filter(function(element) { return element != "";});

		var lastElement = array.pop();
		//Om sista elementet inte är ett NaN, så är det ett nummer, och 
		// vi antar att vi är i ett whiteboard
		if (!isNaN(lastElement)) {
		    whiteboard_context(context_area);
		}
		else {
		    start_page_context(context_area);
		}
	    });
	$('#toolbox_container').trigger('update');
});

function gui_split_vertically(event) {
		//Om vi inte redan satt flaggan, eller den är åt andra hållet,
		//sätter vi den vertikalt
		if ($("#split_buttons_container").data("split_direction") == "none" || 
		$("#split_buttons_container").data("split_direction") == "horizontal") 
		{
		    
		    reset_split();
		    //Vi använder en klass för att styla knappen som nedtryckt
		    $("#split_vert").addClass("depressed"); 
		    $("#split_buttons_container").data("split_direction", 
						  "vertical"); 
		    set_split();
		}
		//Om vi redan inlett det ångrar ett till klick
		else if ($("#split_buttons_container").data("split_direction") 
		== "vertical") {
			reset_split();
		}
		//Annars gör vi inget
};

function gui_split_horizontally(event) {

		//Om vi inte redan satt flaggan, eller den är åt andra hållet,
		//sätter vi den horizontellt
		if ($("#split_buttons_container").data("split_direction") == "none" || 
		$("#split_buttons_container").data("split_direction") == "vertical") 
		{
		    reset_split();
		    $("split_vert").removeClass("depressed");
		    //Vi använder en klass för att styla knappen som nedtryckt
		    $("#split_horiz").addClass("depressed"); 
		    $("#split_buttons_container").data("split_direction", 
						  "horizontal"); 
		    set_split();
		}
		//Om vi redan inlett det ångrar ett till klick
		else if ($("#split_buttons_container").data("split_direction") 
		== "horizontal") {
			reset_split();
		}
		//Annars gör vi inget

}

function whiteboard_context(context_area) {
    update_info_box();
    if ($("#split_buttons_container").length == 0) {
	var split_buttons = $('<div></div>');
   
	split_buttons.attr('id','split_buttons_container');
	split_buttons.data("split_direction", "none");
	var split_horiz = $('<img/>');
	var split_vert = $('<img/>');
	split_horiz.attr('id','split_horiz');
	split_vert.attr('id', 'split_vert');

	split_vert.attr('src','/images/button_v.png');
	split_horiz.attr('src','/images/button_h.png');

	split_horiz.addClass('split_button');
	split_vert.addClass('split_button');
	split_buttons.append(split_horiz);
	split_buttons.append(split_vert);

	split_horiz.click(gui_split_horizontally);
	split_vert.click(gui_split_vertically);

	context_area.append(split_buttons);
    }
    // Om någon note är markerad kör vi funktionen note_selected_context
    if ($('.selected').length > 0) {
	note_selected_context(context_area);
    }
    else {
	//Ta bort color-choosern från context_area
	context_area.children("#color_chooser").remove();
    }
    
    // Add split options
};

function note_selected_context(context_area) {
    if (context_area.children("#color_chooser").length == 0) {
	var color_chooser = $('<ul></ul>');
	var colors = ["green", "blue", "yellow", 
		      "red", "orange", "pink", 
		      "#f4e476", "crimson","fuchsia"];

	for (var i=0; i < colors.length; i++) {
	    var color = $('<li></li>');
	    color.addClass("palette_color");
	    color.css('background-color', colors[i]);
	    color_chooser.append(color);
	}

	color_chooser.attr('id','color_chooser');

	context_area.append(color_chooser);
    }
};

function start_page_context(context_area) {

	update_info_box();

};

// Context area är ett jquery-wrappat element där context-beroende data skall
// läggas till
function board_selected_context(context_area) {

};

function reset_info_box(){
	
	$('#toolbox_header_name').text("Name");
	$('#toolbox_info_created').text("");
	$('#toolbox_info_updated').text("");
	$('#toolbox_info_owner').text("");
	$('#toolbox_info_name').text("");

};

//Funktion för att hämta information via json om objektet.
function update_info_box(){
	
	var toolbox_name = $('#toolbox_header_name');
	var toolbox_info_created = $('#toolbox_info_created');
	var toolbox_info_updated = $('#toolbox_info_updated');
	var toolbox_info_owner = $('#toolbox_info_owner');
	var toolbox_info_name = $('#toolbox_info_name');

	if($(".selected").length==1){
		var e = $(".selected:eq(0)");

		if($(e).hasClass("note")) {
			id = e.id8Up();
			var board_id = e.data('board_id').split('_').pop();
			$.ajax({
				url: '/boards/' + board_id + '/notes/' + id + '.json',
				type: 'GET',
				success: function(data, textStatus, jqXHR){
					if((data.note.header).length > 8){
						toolbox_name.text(
							($(e).text().trim()).substring(7,0) + "..."
						);
					} else {
						toolbox_name.text(data.note.header);
					}
					toolbox_info_created.text("Created: " + data.note.created_at);
					toolbox_info_updated.text("Updated: " + data.note.updated_at);
				//	toolbox_info_owner.text("Owner: " + data.note.owner_id);

				}
			})
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
			})
		}
	}	
	else if($(".selected").length==0){
		toolbox_name.text("Name");
		toolbox_info_created.text(" ");
		toolbox_info_updated.text(" ");
		toolbox_info_owner.text(" ");
		toolbox_info_name.text(" ");

	}
	else{
		toolbox_info_name.html('');
		toolbox_name.text($(".selected").length + " notes  selected");
		//Loop-funktion för att hämta ut namnen på de markerade objekten.
		toolbox_info_name.text($(".selected").each(
			function(){
				if(($(this).text().trim()).length > 11){
					toolbox_info_name.append(($(this).text().trim()).substring(10,0) + "..." + "<br>")
				} else {
					toolbox_info_name.append($(this).text() + "<br>");
				}

			}
		));
		toolbox_info_created.text(" ");
		toolbox_info_updated.text(" ");			
		toolbox_info_owner.text(" ");
	}
};