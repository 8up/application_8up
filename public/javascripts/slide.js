$(document).ready(function(){
  $("#toolbox_area_2").click(function(){
      $("div#toolbox_area_1").toggle();
      $('#boards_container').css('margin-left', $('#toolbox_container').width() + 'px');
       var panel_arrow=$("#panel_arrow");
      if (panel_arrow.attr("src")== "/images/panel_button_right.png") {
            panel_arrow.attr("src", "/images/panel_button_left.png");
            } else {
            panel_arrow.attr("src", "/images/panel_button_right.png");}
      
      
});
});