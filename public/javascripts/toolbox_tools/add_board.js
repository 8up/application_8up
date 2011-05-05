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
