window.channel.bind('split-field', function(data){
	var new_fields = [];
	_.each(data.fields, function(field){
		field = field.field;
		var $field = $('#field_' + field.id);
		if($field.length == 0){
		    //Skapa nytt fält, eller döp om det 
		    //temporära om denna klient är den
		    //som gjorde splitten
		    if ($('#tmp_field').length == 1) {
			$field = $('#tmp_field');
		    } 
		    else {  
			$field = $('.field').first().clone();
		    } 		    
		    $field.attr('id', 'field_' + field.id);
		    $field.empty();
		    $('.board_div').append($field);
		    new_fields.push($field);
		    
		    // Flytta de notes som skall till det nya fältet
		    for (var i=0; i < data.notes.length; i++) {
			var $note = $("#note_" + data.notes[i].note.id);
			var offset = $note.offset();
			$note.appendTo($field);
			$note.offset(offset);
		    }
		}
	    });
	update_fields(data);
	for (var i = 0; i < new_fields.length; i++) {
	    attach_field_handlers(new_fields[i]);    
	}
    });

function do_split(e) {
    var data = e.data;
    var field = $(this);
    var direction = data['direction'];

    //Om direction varken är vertical eller horizontal gör vi inget
    if (!(direction == "vertical" || direction == "horizontal")) {
	return true;
    }
    var board_id =field.parent().id8Up(); 
    var field_id = field.id8Up();                         
   
    var new_field = field.clone(); //klonen används medan vi väntar på 
    new_field.html(''); //radera innehållet i klonen
    new_field.attr("id", "tmp_field");
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
		split_direction : direction, split_position: split_position } //, 
		/*		success: function(data) {
		new_field.attr("id", "field_" + data.new_field.field.id); 
		    // Här kommer vi måsta lägga in kod för att 
		    // flytta notes från det gamla fältet till det nya
        update_fields(data);
        }*/
	  });
  
    data['split_element'].tool_deactivate();
};


//Remove the split-handler from all fields
function reset_split() {
    $(".field").unbind("click",do_split);
    $(".field").unbind("mouse_move", split_helper_mover);
    $(".split_helper").remove();
};

//Set the split-handler for all fields
function set_split(direction, element) {
    var split_helper = $("<div/>");
    split_helper.addClass("split_helper");
    $(".board_div").append(split_helper);
    
    $(".field").bind("mousemove", 
		     {split_helper:split_helper,
			     direction: direction}, 
		     split_helper_mover);
    $(".field").bind("click",{split_helper: split_helper, 
		direction: direction, 
		split_element: element},do_split);
};

function split_helper_mover(event) {
    var field = $(this);
    var direction = event.data.direction;
    if (direction == "horizontal") {
	event.data.split_helper.width(field.width());
	event.data.split_helper.offset({left: field.offset().left, top: event.pageY});
    }
    else if (direction == "vertical") {
	event.data.split_helper.height(field.height());
	event.data.split_helper.offset( { top: field.offset().top, 
		    left: event.pageX });
    }
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