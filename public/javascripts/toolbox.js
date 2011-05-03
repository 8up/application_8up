$(document).ready(function(){
	$('#split_horiz').click(gui_split_horizontally);
	$('#split_vert').click(gui_split_vertically);
    
	$('.toolbox_button_invite').click(function(){
	show_invite();
  });
	$('.toolbox_button_edit').click(function(){
	window.location = '/boards/' + $('.selected').id8Up() + '/edit'	

  });
	$('.toolbox_button_add').click(function(){
	window.location = '/boards/new'

  });
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
    // Visa verktyg specifikt för board-vyn
    $("#board_view").show();
    $('#boards_overview').hide();
    
    // Om någon note är markerad kör vi funktionen note_selected_context
    if ($('.selected').length > 0) {
	$("#notes_selected").show();
	note_selected_context(context_area);
    }
    else {
	//Ta bort color-choosern från context_area
	$("#notes_selected").hide();
	reset_info_box();
    }
};

function note_selected_context(context_area) {
    update_info_box_notes();


    // nedan skall bara kalla show eller hide på rätt element i toolboxen
    if ($("#color_chooser").children('li').length == 0) {
	var color_chooser = $('#color_chooser');
	var colors = ["green", "blue", "yellow", 
		      "red", "orange", "pink", 
		      "#f4e476", "crimson","fuchsia"];

	for (var i=0; i < colors.length; i++) {
	    var color = $('<li></li>');
	    color.addClass("palette_color");
	    color.css('background-color', colors[i]);
	    color.click(color_palette_handler);
	    color_chooser.append(color);
	}
    }
};

function start_page_context(context_area) {
    $('#board_view').hide();;
    $('#boards_overview').show();;
    if ($('.board_container.selected').length > 0) {
	$('#boards_selected').show();
	board_selected_context(context_area);
    }
    else {
	$('#boards_selected').hide();
	reset_info_box();
    }
};

// Context area är ett jquery-wrappat element där context-beroende data skall
// läggas till
function board_selected_context(context_area) {
      update_info_box_board();
};

function reset_info_box(){
	$('#toolbox_info_created').text("");
	$('#toolbox_info_updated').text("");
	$('#toolbox_info_owner').text("");
	$('#toolbox_info_name').text("");
};

function update_info_box_notes() {
    var selected_items = $(".note.selected"); 
    if (selected_items.length == 0) {
	return false;
    }
    else if (selected_items.length == 1) {
	var selected = $(selected_items[0]);
	var id = selected.id8Up();
	var board_id = selected.data('board_id').split('_').pop();
	var url = '/boards/' + board_id + '/notes/' + id + '.json'

	$.ajax({url: url, type: 'GET',
		success: function(data, textStatus, jqXHR){
		    var name = [];
		    if((data.note.header).length > 11){
			//trimma namnet om det är för långt
			var trimmed_name = data.note.header.trim(); 
			name.push(trimmed_name.substring(7,0) + "...");
		    } 
		    else {
			name.push(data.note.header);
		    }
		    update_info_box(name, data.note.created_at, data.note.updated_at, 
				    null);
		}
	    });	
    }
    else {
	var info_text = [];
	info_text.push( $(selected_items).length + ' notes selected:');
	//Loop-funktion för att hämta ut namnen på de markerade objekten.
	selected_items.each(function(){
		if(($(this).text().trim()).length > 11){
		    var trimmed_name = $(this).text().trim();
		    var abbriviated_name = trimmed_name.substring(10,0) + "...";
		    info_text.push(abbriviated_name);
		} 
		else {
		    info_text.push($(this).text().trim());
		}	
	    });
	
	update_info_box(info_text, null, null, null);
    }
};

//Funktion för att uppdatera info-boxen om notes är markerade
function update_info_box_board() {
    var selected_items = $(".board_container.selected"); 
    if (selected_items.length == 0) {
	return false;
    }
    else if (selected_items.length == 1) {
	var selected = $(selected_items[0]);
	var board_id = selected.id8Up();
	var url = '/boards/' + board_id + '.json'
	$.ajax({url: url, type: 'GET',
		success: function(data, textStatus, jqXHR){
		    var name = [];
		    if((data.board.name).length > 8){
			//trimma namnet om det är för långt
			var trimmed_name = data.board.name.trim(); 
			name.push(trimmed_name.substring(7,0) + "...");
		    } 
		    else {
			name.push(data.board.name);
		    }
		    update_info_box(name, data.board.created_at, data.board.updated_at, 
				    data.board.owner_name);
		}
	    });	
    }
    else {
	var info_text = [];
	info_text.push($(selected_items).length + ' boards selected:');
	//Loop-funktion för att hämta ut namnen på de markerade objekten.
	selected_items.each(function(){
		if(($(this).text().trim()).length > 11){
		    var trimmed_name = $(this).text().trim();
		    var abbriviated_name = trimmed_name.substring(10,0) + "...";
		    info_text.push(abbriviated_name);
		} 
		else {
		    info_text.push($(this).text().trim());
		}	
	    });
	
	update_info_box(info_text, null, null, null);
    }
}


//Funktion för att hämta information via json om objektet.
function update_info_box(names, created, updated, owner){
    reset_info_box();
    var toolbox_info_created = $('#toolbox_info_created');
    var toolbox_info_updated = $('#toolbox_info_updated');
    var toolbox_info_owner = $('#toolbox_info_owner');
    var toolbox_info_name = $('#toolbox_info_name');

    if (names != "" && names != null) {
	for (var i = 0; i < names.length; i++) {
	    toolbox_info_name.append(names[i]);
	    toolbox_info_name.append('<br/>');
	}
    }
    if (created != "" && created != null) {
	toolbox_info_created.text(created);
    }
    if (updated != "" && update != null) {
	toolbox_info_updated.text(updated);
    }
    if (owner != "" && owner != null) {
	toolbox_info_owner.text(owner);
    }
};