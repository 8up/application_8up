$(document).ready(function(){
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


//Funktion för att uppdatera info-boxens innehåll
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
        function(memo, name){ return memo + '</br>' + name}
      );
    toolbox_info_participants.html('Participants:</br>' + text.value());
  }
};


