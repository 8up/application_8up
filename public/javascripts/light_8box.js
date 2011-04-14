$(document).ready(function(){
  $( "div.note" ).dblclick(function(e){
    if(e.target === this)
    note_box(e);
  });

  $("#window_wrapper").click(function(e){
    if(e.target == this)
    {
      note_hide();
    }
  });



  $(this).keydown(function(e) {

    keycode = e.which;
    if(keycode == 27){ 
      note_hide();
    }
  });

  f = {};
  $("#note_body").dblclick(f = function(e){
    add_panel();
    $(this).unbind('dblclick', f);
  });
});

function add_panel() {
  noteNiceEditor = new nicEditor({onSave : function(content, id, instance){
    var note_id = $( "#window_wrapper" ).data('note_id');
    var board_id = $('.board_div').id8Up();
    var url_path =  board_id + "/notes/" + note_id + '.json';
    $('#note_body').blur();
    $.ajax({ url: url_path, 
      type: 'POST',
      data: {_method:'PUT',
      'note[body]': content 	},
      success: function(data, textStatus, jqXHR){
        remove_panel();
      }
    });
    }});


    if( $('#note_editor_panel').length == 0)
    $('#note_editor_panel_wrapper').html("<div id='note_editor_panel'></div");

    noteNiceEditor.setPanel('note_editor_panel');
    noteNiceEditor.addInstance('note_body');
  }

  function remove_panel(){
    noteNiceEditor.removePanel('note_editor_panel');
    noteNiceEditor.removeInstance('note_body');
    $('#note_body').bind('dblclick', f);

  }




  note_hide = function(e){
    var body = $('body');
    $( "#window_wrapper" ).hide();
    $( "#black_background" ).hide();
    body.css('overflow', 'auto');
    var scroll = body.data('scroll');
    body.scrollTop(scroll); 
    remove_panel();

  }

  note_box = function(e){
    var id = $(e.target).id8Up();
    var board_id = $('.board_div').id8Up();

    $.ajax({ 
      url: '/boards/' + board_id + '/notes/' + id + '/content.json', 
      type: 'GET',
      success: function(data, textStatus, jqXHR){
        var note_body = $('#note_body');
        note_body.html(data.note.body);
        note_body.parent().css('background-color', data.note.color);
        $( "#window_wrapper" ).show().data('note_id', id);
        $( "#black_background" ).show();
      }
    });
    var body = $('body');
    var scroll = body.scrollTop();
    body.data('scroll',scroll).scrollTop(0);
    body.css('overflow', 'hidden');

  };

