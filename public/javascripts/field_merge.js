$(document).ready(function()
{
  $(".resizable8up-handle").click(function(e)
  {
    alert("hej");
    alert("hej2");
    var resizable8up_handle = $(e.target);
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
      alert("vert");
      
      if(resizable8up_handle.hasClass("resizable8up-n"))
      {
        alert("testvert");
        if(field_1_neighbours_n.length == 1)
        {
          field_2 = $(("#field_" + field_1_neighbours_n[0]));
          merge_direction = "north";
        }
        else if(field_1_neighbours_n.length > 1) 
        {
          alert("Kan inte merga dessa fält!");
        }

      }
      else 
      {
        if(field_1_neighbours_s.length == 1) 
        {
          alert("testvert");
          field_2 = $(("#field_" + field_1_neighbours_s[0]));
          merge_direction = "south";
        }
        else if(field_1_neighbours_s.length > 1) 
        {
          alert("Kan inte merga dessa fält!");
        }
        
      }
        
    }
    else if (resizable8up_handle.hasClass("resizable8up-w") || resizable8up_handle.hasClass("resizable8up-e")) 
    {
      alert("horiz");
      
      if(resizable8up_handle.hasClass("resizable8up-w")) 
      {
        if(field_1_neighbours_w.length == 1)
        {
          alert("testhoriz");
          field_2 = $(("#field_" + field_1_neighbours_w[0]));
          merge_direction = "west";
        }
        else if(field_1_neighbours_w.length > 1) 
        {
          alert("Kan inte merga dessa fält!");
        }
    
      }
      else 
      {
        if(field_1_neighbours_e.length == 1) 
        {
          alert("testhoriz");
          field_2 = $(("#field_" + field_1_neighbours_e[0]));
          merge_direction = "east";
        }
        else if(field_1_neighbours_e.length > 1) 
        {
        alert("Kan inte merga dessa fält!");
        }
    
      }  
    }
    alert("fieldmerge");
    field_merge(field_1, field_2, merge_direction);
  });
}); 


function field_merge(field_1, field_2, merge_direction)
{
  var board_id =field_1.closest(".board_div").id8Up(); 
  var field_id = field_1.id8Up();   
  var new_height = field_1.height() + field_2.height();
  var new_width = field_1.width() + field_2.width();
    
  if (merge_direction == "north")
    {
    field_2.height(new_height);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_2, field_to_delete : field_1, merge_direction : "vertical"} , success: function(data) {}})
    }
  if (merge_direction == "west")
    {
    field_2.width(new_width);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_2, field_to_delete : field_1, merge_direction : "horizontal"} , success: function(data) {}})
    }
  if (merge_direction == "south")
    {
    field_1.height(new_height);  
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1, field_to_delete : field_2, merge_direction : "vertical"} , success: function(data) {}})
    }
  if (merge_direction == "east")
    {
    field_1.width(new_width);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1, field_to_delete : field_2, merge_direction : "horizontal"} , success: function(data) {}})
    }
}