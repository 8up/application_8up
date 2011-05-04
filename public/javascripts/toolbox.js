$(document).ready(function(){
  $('#split_horiz').click(gui_split_horizontally);
  $('#split_vert').click(gui_split_vertically);

  $('.toolbox_button_add').click(function(){
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

function add_board() {
  var new_board = $('#board_template').clone();

  //Leta upp boardets innehåll
  var board_link = new_board.find('a.board_link');
  var board_content = new_board.find('.board_name')

  new_board.attr("id","board_new");

  var url = "/boards.json";
  var view_height = $(window).height();
  var view_width = $(window).width();
  board_content.text('')
  $('#workspace').append(new_board);
  new_board.fadeIn();

  data = {"board[name]": "No title",
  "options[size]" : { width: view_width, 
    height: view_height }};
    $.ajax({url: url, type: "POST", data: data, success: function(data) {
      var id= "board_" + data.board.id;
      var link_ref = "/boards/" + data.board.id;
      new_board.attr("id", id);
      board_link.attr('href',link_ref);
      board_content.text(data.board.name);
      edit_board_name(board_content);
    }
  });

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
