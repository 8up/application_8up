$(document).ready(function()
{
  $(".resizable8up-handle").mouseenter(function(e)
  { 
    var resizable8up_handle = $(e.target);
    var hover_div = $('<div></div>');
    hover_div.addClass("hover");
    hover_div.height(25);
    hover_div.width(25);
    hover_div.css('z-index','270');
    hover_div.css('position','absolute');
    hover_div.css('background-color','black');
    
    if(resizable8up_handle.hasClass("resizable8up-n"))
    {
      var n_offset_top = 0;
      var n_offset_left = resizable8up_handle.width()/2 - hover_div.width()/2;
      hover_div.offset({top: n_offset_top});
      hover_div.offset({left: n_offset_left});
    }
    else if(resizable8up_handle.hasClass("resizable8up-s"))
    {
      var s_offset_top = resizable8up_handle.height() - hover_div.height();
      var s_offset_left = resizable8up_handle.width()/2 - hover_div.width()/2;
      hover_div.offset({top: s_offset_top}); 
      hover_div.offset({left: s_offset_left});
    }
    else if(resizable8up_handle.hasClass("resizable8up-w"))
    { 
      var w_offset_top = resizable8up_handle.height()/2 - hover_div.height()/2;
      var w_offset_left = 0;
      hover_div.offset({top: w_offset_top});
      hover_div.offset({left: w_offset_left});
    }
    else if(resizable8up_handle.hasClass("resizable8up-e"))
    {
      var e_offset_top = resizable8up_handle.height()/2 - hover_div.height()/2;
      var e_offset_left = resizable8up_handle.width() - hover_div.width();
      hover_div.offset({top: e_offset_top});
      hover_div.offset({left: e_offset_left});
    }

    resizable8up_handle.prepend(hover_div);
    hover_div.click(click_merge);
  });
 
 $(".resizable8up-handle").mouseleave(function(e)
  {
    
    $(this).children(".hover").fadeOut(5000, function () {
    $(this).remove();
    });
  });  
}); 


function click_merge(e)
{
  alert("test");
  var resizable8up_handle = $(e.target).parent();
  var field_1 = resizable8up_handle.parent();
  var field_1_neighbours = field_1.data("neighbours");
  var field_1_neighbours_n = field_1_neighbours["north"];
  var field_1_neighbours_s = field_1_neighbours["south"];
  var field_1_neighbours_w = field_1_neighbours["west"];
  var field_1_neighbours_e = field_1_neighbours["east"];
  var field_2;
  var merge_direction;

  if (resizable8up_handle.hasClass("resizable8up-n") || resizable8up_handle.hasClass("resizable8up-s")) 
  {      
    if(resizable8up_handle.hasClass("resizable8up-n"))
    {
      if(field_1_neighbours_n.length == 1)
      {
        field_2 = $(("#field_" + field_1_neighbours_n[0]));
        if(field_2.data("neighbours")["south"].length != 1)
        {
          alert("Kan inte merga dessa fält");
        }
        merge_direction = "north";
      }
      else if(field_1_neighbours_n.length != 1) 
      {
        alert("Kan inte merga dessa fält!");
      }
    }
    else 
    {
      if(field_1_neighbours_s.length == 1) 
      {
        field_2 = $(("#field_" + field_1_neighbours_s[0]));
        if(field_2.data("neighbours")["north"].length != 1)
        {
          alert("Kan inte merga dessa fält");
        }
        merge_direction = "south";
      }
      else if(field_1_neighbours_s.length != 1) 
      {
        alert("Kan inte merga dessa fält!");
      }
    }
  }
  else if (resizable8up_handle.hasClass("resizable8up-w") || resizable8up_handle.hasClass("resizable8up-e")) 
  {      
    if(resizable8up_handle.hasClass("resizable8up-w")) 
    {
      if(field_1_neighbours_w.length == 1)
      {
        field_2 = $(("#field_" + field_1_neighbours_w[0]));
        if(field_2.data("neighbours")["east"].length != 1)
        {
          alert("Kan inte merga dessa fält");
        }
        merge_direction = "west";
      }
      else if(field_1_neighbours_w.length != 1) 
      {
        alert("Kan inte merga dessa fält!");
      }
    }
    else 
    {
      if(field_1_neighbours_e.length == 1) 
      {
        field_2 = $(("#field_" + field_1_neighbours_e[0]));
        if(field_2.data("neighbours")["west"].length != 1)
        {
          alert("Kan inte merga dessa fält");
        }
        merge_direction = "east";
      }
      else if(field_1_neighbours_e.length != 1) 
      {
        alert("Kan inte merga dessa fält!");
      }
    }  
  }
  field_merge(field_1, field_2, merge_direction);
}

function field_merge(field_1, field_2, merge_direction)
{
  var board_id =field_1.closest(".board_div").id8Up(); 
  var field_id = field_1.id8Up();
  var new_height = field_1.height() + field_2.height();
  var new_width = field_1.width() + field_2.width();
    
  if (merge_direction == "north")
    {
    field_2.height(new_height);
    field_1.children(".note").each(function() 
    {
      $(this).position({top: $(this).parent.height() + $(this).position().top});  
    });
    field_1.children('.note').appendTo(field_2);
    field_1.remove();
    
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_2.id8Up(), field_to_delete : field_1.id8Up(), merge_direction : "vertical"} , success: update_fields})
    }
  if (merge_direction == "west")
    {
    field_2.width(new_width);
    field_1.children('.note').each(function() 
    {
      $(this).position({left: $(this).parent.height() + $this.position().top});
    });    
    field_1.children('.note').appendTo(field_2);
    field_1.remove();
    $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_2.id8Up(), field_to_delete : field_1.id8Up(), merge_direction : "horizontal"} , success: update_fields})
    }
  if (merge_direction == "south")
    {
    field_1.height(new_height);
    field_2.children('.note').each(function() 
    {
      $(this).position({top: $(this).parent.height() + $(this).position().top});
    });    
    field_2.children('.note').appendTo(field_1);
    field_2.remove();
    $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1.id8Up(), field_to_delete : field_2.id8Up(), merge_direction : "vertical"} , success: update_fields})
    }
  if (merge_direction == "east")
    {
    field_1.width(new_width);
    field_2.children('.note').each(function() 
    {
      $(this).position({left: $(this).parent.height() + $(this).position().top});  
    });    
    field_2.children('.note').appendTo(field_1);
    field_2.remove();
    $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1.id8Up(), field_to_delete : field_2.id8Up(), merge_direction : "horizontal"} , success: update_fields })
    }
}