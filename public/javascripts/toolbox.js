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
    //date_info_box();

    // Denn if-sats lägger till en split-div om ingen redan finns
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
    update_info_box_notes();

    if (context_area.children("#color_chooser").length == 0) {
	var color_chooser = $('<ul></ul>');
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

	color_chooser.attr('id','color_chooser');

	context_area.append(color_chooser);
    }
};

function start_page_context(context_area) {
    if ($('.board_container.selected').length > 0) {
	board_selected_context(context_area);
    }
    else {
	reset_info_box();
    }
    
};

// Context area är ett jquery-wrappat element där context-beroende data skall
// läggas till
function board_selected_context(context_area) {
      update_info_box_board();
};

function reset_info_box(){
	$('#toolbox_header_name').text("");
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
				    null, null);
		}
	    });	
    }
    else {
	var info_text = [];
	info_text.push($('<h1>' + selected_items.length + ' notes selected:</h1>'));
	//Loop-funktion för att hämta ut namnen på de markerade objekten.
	selected_items.each(function(){
		if(($(this).text().trim()).length > 11){
		    var trimmed_name = $(this).text().trim();
		    var abbriviated_name = trimmed_name.substring(10,0) + "...";
		    info_text.push(abbriviated_name);
		    info_text.push('<br/>');
		} 
		else {
		    info_text.push($(this).text().trim());
		    info_text.push('<br/>');
		}	
	    });
	
	update_info_box(info_text, null, null, null, null);
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
				    data.board.owner_name, null);
		}
	    });	
    }
    else {
	var info_text = [];
	info_text.push($('<h1>' + selected_items.length + ' boards selected:</h1>'));
	//Loop-funktion för att hämta ut namnen på de markerade objekten.
	selected_items.each(function(){
		if(($(this).text().trim()).length > 11){
		    var trimmed_name = $(this).text().trim();
		    var abbriviated_name = trimmed_name.substring(10,0) + "...";
		    info_text.push(abbriviated_name);
		    info_text.push('<br/>');
		} 
		else {
		    info_text.push($(this).text().trim());
		    info_text.push('<br/>');
		}	
	    });
	
	update_info_box(info_text, null, null, null, null);
    }
}


//Funktion för att hämta information via json om objektet.
function update_info_box(names, created, updated, owner, info_text){
    reset_info_box();
	var toolbox_name = $('#toolbox_header_name');
	var toolbox_info_created = $('#toolbox_info_created');
	var toolbox_info_updated = $('#toolbox_info_updated');
	var toolbox_info_owner = $('#toolbox_info_owner');
	var toolbox_info_name = $('#toolbox_info_name');

	if (names != "" && names != null) {
	    toolbox_name.empty();
	    for (var i = 0; i < names.length; i++) {
		toolbox_name.append(names[i]);
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
	if (info_text != "" && info_text != null) {
	    toolbox_info_name.text(info_text);
	}
};