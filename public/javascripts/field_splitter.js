$(document).ready(function() {
	//börja med att stätta split_Set till false på split-tabellen 
	//flaggan används för att avgöra om vi redan 
	//initierat split-funktionen så att vi inte bindar split till fälten mer än en gång
	$("#split_button_table").data("split_set", "none"); 
	$("#split_button_table").data("split_direction", "none"); 
    });

function do_split(e) {
    var field = $(this)
    var direction = $("#split_button_table").data("split_direction");
    

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

    

    reset_split(); //återställ
};

//Remove the split-handler from all fields
function reset_split() {
    $(".field").unbind("click",do_split);
    $("#split_button_table #split_vert,#split_horiz").removeClass("depressed");
    $("#split_button_table").data("split_direction", "none");
};

//Set the split-handler for all fields
function set_split() {
    $(".field").bind("click",do_split);
};
