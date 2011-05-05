/*
 Tools skall fungera så här: det finns två varianter, momentana och aktiverade.
 Momentana utför den önskade åtgärden direkt (delete, add board, invite)
 Aktiverade (add note, split field, osv) sätter verktyget som aktivt, varvid alla andra sätts 
 till icke-aktiva. Det aktiva verktyget skall deaktiveras när det utfört sin handling
 Klasser på tools som används:
 tool - alla tools skall ha denna klass
 tool_active - talar om ifall ett verktyg är aktivt

 data som används på tools:
 data-tool_type: [instant, activated, toggle] - talar om vilken sorts verktyg det är
 data-tool_state: [active, inactive] - vilket tillstånd detta tool är i, i första hand används det för aktiverade tools för att aktivera om man trycker på samma tool två gånger
 data-tool_data: data som ett tool behöver för att köras
 
 Alla tools skall ha handlers som lyssnar på eventet 'activate'. Tools som är 
 aktiverbara skall också ha en funktion som lyssnar på 'deactivate'
*/


$(document).ready(function(){
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
	$('.toolbox_button_add').bind('activate', function(){
		add_board();
	    });
 
  $('.toolbox_button_invite').click(function(e){
    show_invite($('.board_div').id8Up())
  })
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

  $('.palette_color').click(color_palette_handler);
  //$('.palette_color').bind('activate', color_palette_handler);

  $("#toolbox_container").bind('update',function(){
    var context_area = $('#context_area');
    if (window.page_context=="whiteboard") {
      whiteboard_context(context_area);
    }
    else {
      start_page_context(context_area);
    }
  });
  $('#toolbox_container').trigger('update');

  $('.tool').click(tool_pressed_handler);
});

//Jquery-funktion som deaktiverar tools
(function($){
	jQuery.fn.tool_deactivate = function(){
	    this.each( function() {
		    $(this).trigger('deactivate');
		    if ($(this).data('tool_state') == "active") {
			$(this).removeClass("tool_active");
			$(this).data('tool_state', "inactive");
		    }    
		})
	}
})(jQuery);


// Denna funktion ser till att aktivera verktygets funktion, och deaktivera alla andra
function tool_pressed_handler(event) {
    var tool = $(event.target);

    // Om eventet inte är ett tool returnerar vi bara
    if (!tool.hasClass('tool')) {
	return true;
    }
    
    if (tool.data('tool_type') == "activated") {
	//Kolla om verktyget redan var aktivt, i sådana fall skall det deaktiveras

	if (tool.data('tool_state') == "active") {
	    tool.tool_deactivate();
	    return true;
	}	
	//deaktivera alla tools
	$(".tool").tool_deactivate();
	   
	//Aktivera detta tool
  	tool.data('tool_state', "active");
	tool.addClass('tool_active');
	
	tool.trigger('activate');
    }
    else if (tool.data('tool_type') == "instant") {
	$(".tool").trigger('deactivate');
	tool.trigger('activate'); //kör verktyget
    }
    else if (tool.data('tool_type') == "toggle")
	{
	    //Här skall kod för toggle-tool finnas, exempelvis avatar
	}
}

function whiteboard_context(context_area) {
  // Visa verktyg specifikt för board-vyn
  $(".board_view").show();
  $('.boards_overview').hide();

  // Om någon note är markerad kör vi funktionen note_selected_context
  if ($('.selected').length > 0) {
    $(".notes_selected").show();
    note_selected_context(context_area);
  }
  else {
    //Ta bort color-choosern från context_area
    $(".notes_selected").hide();
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

      color_chooser.append(color);
    }
  }
};

function start_page_context(context_area) {
  $('.board_view').hide();;
  $('.notes_selected').hide();;
  $('.boards_overview').show();;
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
  $('#toolbox_info_name').text("Nothing selected");
  $('#toolbox_info_created').text("");
  $('#toolbox_info_updated').text("");
  $('#toolbox_info_owner').text("");
  $('#toolbox_info_participants').text("");  
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
      if((data.note.header).length > 12){
        //trimma namnet om det är för långt
        var trimmed_name = data.note.header.trim(); 
        name.push(trimmed_name.substring(11,0) + "...");
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
      if(($(this).text().trim()).length > 12){
        var trimmed_name = $(this).text().trim();
        var abbriviated_name = trimmed_name.substring(11,0) + "...";
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
      if( $('.board_container.selected').length > 0){

        var name = [];
        if(data.board.name.length > 12){
          //trimma namnet om det är för långt
          var trimmed_name = data.board.name.trim(); 
          name.push(trimmed_name.substring(11,0) + "...");
        } 
        else {
          name.push(data.board.name);
        }
        update_info_box(name, data.board.created_at, data.board.updated_at, 
          data.board.owner_name, data.board.participants);
        
        }else{
          reset_info_box();
        }
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
function update_info_box(names, created, updated, owner, participants){
  reset_info_box();
  var toolbox_info_created = $('#toolbox_info_created');
  var toolbox_info_updated = $('#toolbox_info_updated');
  var toolbox_info_owner = $('#toolbox_info_owner');
  var toolbox_info_name = $('#toolbox_info_name');
  var toolbox_info_participants = $('#toolbox_info_participants');

  $('#toolbox_info_name').empty();

  if (names != "" && names != null) {
    for (var i = 0; i < names.length; i++) {
      if(i == 0){
        $('#toolbox_info_name').append('Title: ');
      }
      toolbox_info_name.append(names[i]);
      toolbox_info_name.append('<br/>');
    }
  }
  if (created != "" && created != null) {
    toolbox_info_created.text('Created at: ' + created.replace('T', ' ').replace('Z', ''));
  }
  if (updated != "" && updated != null) {
    toolbox_info_updated.text('Updated at: ' + updated.replace('T', ' ').replace('Z', ''));
  }
  if (owner != "" && owner != null) {
    toolbox_info_owner.text('Owner: ' + owner);
  }
  
  if(participants != undefined){
    var text = _(participants).chain()
      .pluck('name')
      .reduce(
        function(memo, name){ memo + '</br>' + name}
      );
    toolbox_info_participants.html('Participants:</br>' + text.value());
  }
};


function edit_board_name(header) {
  var board_container = $(header).closest('.board_container'); 
  var original_text = $(header).html();
  var title_form = $("<form></form>");
  var title_input = $("<input type='text' size='10'></input>");
  //Titeln trimmas för tillfället 
  title_input.val($.trim(original_text));
  var board_id = board_container.attr('id').split('_').pop();
  var url = "/boards/" + board_id;

  //deaktivera alla länkar
  $('a').click(stop_link = function(e) { e.preventDefault(); return false;})

  title_form.append(title_input);
  $(header).replaceWith(title_form);

  title_input.focus();
  title_input.select();

  title_input.blur(function(e) { title_form.submit(); });

  title_form.submit(function(e) { 

    var new_header_text = title_input.val();
    header.text(new_header_text);
    title_form.replaceWith(header);

    $.ajax({url: url, 
      type: "PUT", 
      data: {board : 
        {name : new_header_text}} 

      });

      $('a').unbind('click', stop_link); //Aktivera länkar igen
      return false; //ladda inte om sidan
    });
  };
