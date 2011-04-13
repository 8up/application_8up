$(document).ready(function(){
  $( "div.note" ).dblclick(function(e){
    note_box(e);
  });



  $(this).keydown(function(e) {

    keycode = e.which;
    if(keycode == 27){ 
      $( "#in_focus_image" ).hide();
      $( "#black_background" ).hide();
    }
  });
 
  
});


note_box = function(e){
  var id = $(e.target).attr('id').split('_').pop();
  var board_id = $(e.target).data('board_id').split('_').pop();
  $( "#in_focus_image" ).show();
  $( "#black_background" ).show();
  $.ajax({ 
    url: '/boards/' + board_id + '/notes/' + id + '/content.json', 
    type: 'GET',
    success: function(data, textStatus, jqXHR){
      var note_body = $('#note_body');
      note_body.text(data.note.body);

      var note_header = $('#note_header');
      note_header.text(data.note.header);
      
      var controls = {
        h1: { visible: false },
        h2: { visible: false },
        h3: { visible: false }
      }
      
      $('#note_header').wysiwyg({
        controls: controls,
        iFrameClass: 'note_header_form',
        css: '/stylesheets/editor_style.css'
      });
      
      $('#note_body').wysiwyg({
        controls: controls,
        autoGrow: true,
        maxHeight: 320,
        css: '/stylesheets/editor_style.css'
      });
      
      $( "#black_background" ).click(function(){
        $( "#in_focus_image" ).hide();
        $( "#black_background" ).hide();
        $('#note_header').wysiwyg("save").wysiwyg("destroy");
        $( "#black_background" ).unbind('click');
      });
    }
  });
};

