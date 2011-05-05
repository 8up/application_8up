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
