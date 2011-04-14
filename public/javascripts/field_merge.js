function field_merge(field_1, field_2, merge_direction)
{
  var board_id =field_1.closest(".board_div").id8Up(); 
  var field_id = field_1.id8Up();   
  var new_height = field_1.height() + field_2.height();
  var new_width = field_1.width() + field_2.width();
    
  if (merge_direction = "north")
    {
    field_2.height(new_height);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_2, field_to_delete : field_1, merge_direction : "height"} , success: function(data) {}})
    }
  if (merge_direction = "west")
    {
    field_2.width(new_width);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_2, field_to_delete : field_1, merge_direction : "width"} , success: function(data) {}})
}
  if (merge_direction = "south")
    {
    field_1.height(new_height);  
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1, field_to_delete : field_2, merge_direction : "height"} , success: function(data) {}})
    }
  if (merge_direction = "east")
    {
    field_1.width(new_width);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1, field_to_delete : field_2, merge_direction : "width"} , success: function(data) {}})
    }
}