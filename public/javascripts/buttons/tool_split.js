function do_split(e) {
    var data = e.data;
    var field = $(this);
    var direction = data['direction'];

    //Om direction varken är vertical eller horizontal gör vi inget
    if (!(direction == "vertical" || direction == "horizontal")) {
	return true;
    }
    var board_id =field.parent().id8Up(); 
    var field_id = field.id8Up();                         ;
   
    var new_field = field.clone();
    new_field.html(''); //radera innehållet i klonen
    new_field.attr("id", "");
    var split_position = 0;
    field.after(new_field); //lägger till det nya fältet i html-koden efter det ursprungliga   
    if (direction == "vertical") {
	split_position = Math.round(e.pageX - field.offset().left);
	var new_width = split_position;
	field.width(new_width);
	new_field.width(new_field.width() - field.width());
    	new_field.offset({left:new_width + field.offset().left}); //adderar positionen till det nya fältet
    }
    else if (direction == "horizontal") {
	split_position = Math.round(e.pageY - field.offset().top);
	var new_height = split_position;
	field.height(new_height);
	new_field.height(new_field.height() - field.height());

	new_field.offset({top: new_height + field.offset().top}); //adderar positionen till det nya fältet
    }

  
    attach_field_handlers(new_field); //lägg till hanterare till det nya fältet
    
    $.ajax({url: "/boards/" + board_id  + 
		"/split_field/" +  field_id , type:"POST", 
		data:{
		split_direction : direction, split_position: split_position } , 
		success: function(data) {
		new_field.attr("id", "field_" + data.new_field.field.id); 
		    // Här kommer vi måsta lägga in kod för att 
		    // flytta notes från det gamla fältet till det nya
		update_fields(data);
    }
	  });
  
    data['split_element'].tool_deactivate();

};

//Remove the split-handler from all fields
function reset_split() {
    $(".field").unbind("click",do_split);
};

//Set the split-handler for all fields
function set_split(direction, element) {
    $(".field").bind("click",{direction: direction, split_element: element},do_split);
};

function activate_horizontal_split(event) {
    set_split("horizontal", $(this));
}

function activate_vertical_split(event) {
    set_split("vertical", $(this));
}

function deactivate_split(event) {
    reset_split();
}

function gui_split_vertically2(event) {
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
