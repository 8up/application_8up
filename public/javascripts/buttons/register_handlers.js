$(document).ready(function(){
	$('#add_avatar').addClass('tool');
	$('#add_avatar').data('tool_type', 'instant');
	$('#add_avatar').bind("click", add_avatar);
  
	$('#remove_avatar').addClass('tool');
	$('#remove_avatar').data('tool_type', 'instant');
	$('#remove_avatar').bind("click", remove_avatar);
  
	// Dessa borde inte vara här, snarare i html-filen, 
	//men de är här tills vidare
	$('#split_horiz').addClass('tool');
	$('#split_horiz').data('tool_type', 'activated');
	$('#split_horiz').data('tool_state', 'inactive');	
	$('#split_horiz').bind('activate', activate_horizontal_split);
	$('#split_horiz').bind('deactivate', deactivate_split);

	$('#split_vert').addClass('tool');
	$('#split_vert').data('tool_type', 'activated');
	$('#split_vert').data('tool_state', 'inactive');	
	$('#split_vert').bind('activate', activate_vertical_split);
	$('#split_vert').bind('deactivate', deactivate_split);

	$('.toolbox_button_add').addClass("tool");
	$('.toolbox_button_add').data('tool_type', 'instant');
	$('.toolbox_button_add').bind('activate', add_board);
 
	$('.palette_color').addClass("tool");
	$('.palette_color').data('tool_type', 'instant');
	$('.palette_color').bind('activate', color_palette_handler);

	$('.toolbox_button_invite').addClass("tool");
	$('.toolbox_button_invite').data('tool_type', 'instant');
	$('.toolbox_button_invite').bind('activate', function(e){
		show_invite($('.board_div').id8Up())
		    });
	
	$('.toolbox_button_create_note').click(function(e){
	      var f;
	      $("div.field").click(f = function(e){
		      if (e.target != this) {
			  return true;
		      }
		      create_note(e);
		      $("div.field").unbind('click', f);
		  });
	  });
    
    $('.board_button_invite').live('click', function(){
			show_invite($('.selected').id8Up());
		    });

		$('.board_button_edit').live('click', function(){
			var board = $(this).closest('.board_container');
			var name = board.find('.board_name');
			window.console.log(name);
			edit_board_name(name);
		    });

		$('.board_button_delete').live('click', function(e){
			delete_selected(e);	
		    });
    
  $('.tool').click(tool_pressed_handler);
});