function add_note_activate(e){
    var button = $(e.target); 
    var ghost = $("<div/>");
    ghost.addClass('ghost-note');
    ghost.addClass("note");
    ghost.css('z-index', '2000');
    ghost.css('opacity', '0.5');
    ghost.css('pointer-events', 'none');
    ghost.css('background-image', 'url(/images/postit_yellow.png)');
    ghost.offset({top:0,left:0});
    ghost.show();
    $('.board_div').append(ghost);
    
    $("div.field").click({note: ghost, button: button} ,field_add_note_handler);
    $("div.board_div").bind("mousemove",{note: ghost} ,ghost_note_move);
}

function add_note_deactivate(e) {
    $('.ghost-note').remove();
    $("div.field").unbind('click', field_add_note_handler);
    $("div.board_div").unbind("mousemove",ghost_note_move);
}

function ghost_note_move(e) {
    var x = e.pageX;
    var y = e.pageY;
    
    e.data['note'].offset({top: y, left: x});
}

function field_add_note_handler(e) {
    if (e.target == this || $(e.target) == e.data['note'] ) {
	
	create_note(e);
	e.data['button'].tool_deactivate();
	
    }
    return true;
}