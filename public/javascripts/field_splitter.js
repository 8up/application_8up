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

    if (direction == "vertical") {
	var new_width = field.width()/2;
	new_field.width(new_width);
	field.width(new_width);
    	new_field.offset({left:new_width}); //adderar positionen till det nya fältet
    }
    else if (direction == "horizontal") {
	var new_height = field.height()/2;
	new_field.height(new_height);
	field.height(new_height);
	new_field.offset({top: new_height}); //adderar positionen till det nya fältet
    }

    field.after(new_field); //lägger till det nya fältet i html-koden efter det ursprungliga   
    attach_field_handlers(new_field); //lägg till hanterare till det nya fältet
    
    $.ajax({url: "/boards/" + board_id  + 
		"/split_field/" +  field_id , type:"POST", 
		data:{split_direction : direction} , 
		success: function(data) {
		new_field.attr("id", "field_" + data.field.id) 
		    // Här kommer vi måsta lägga in kod för att 
		    // flytta notes från det gamla fältet till det nya
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
