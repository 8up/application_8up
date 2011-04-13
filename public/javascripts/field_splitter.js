$(document).ready(function() {
	$(this).keypress(function(e) {
		// Keycodes för v och h, v skall splitta vertikalt, h horisontellt
		//h = 104
		//v = 118
		if (e.which == 104 || e.which == 118) {
		    var split_vertically = e.which == 118;
		    find_split(split_vertically);
		}
	    });
	


    });

function find_split(split_vertically) {
    $(".field").bind("click",split_function = function(e) {
	    if (split_vertically) {
		split_field_vertically(e,$(this));
	    }
	    else {
		split_field_horizontally(e,$(this));
	    }
	    $(".field").unbind("click",split_function);
	}); 
};

function split_field_horizontally(e, field) {
    var new_height = field.height()/2;
    var new_field = field.clone();
    new_field.html(''); //radera innehållet i klonen
    
    new_field.offset({top:new_height}); //adderar positionen till det nya fältet
    new_field.height(new_height);
    field.height(new_height);

    field.after(new_field);
}

function split_field_vertically(e, field) {
    var new_width = field.width()/2;
    var new_field = field.clone();
    new_field.html(''); //radera innehållet i klonen
    
    new_field.offset({left:new_width}); //adderar positionen till det nya fältet
    new_field.width(new_width);
    field.width(new_width);

    field.after(new_field);
};