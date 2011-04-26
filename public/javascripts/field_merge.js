$(document).ready(function(){
  $(".resizable8up-handle").Click(function(e){
    var field_1 = resizeable8up-handle.parent();
    var field_1_neighbours = field_1.data("neighbours");
    var field_1_neighbours_n = field_1_neighbours["north"];
    var field_1_neighbours_s = field_1_neighbours["south"];
    var field_1_neighbours_w = field_1_neighbours["west"];
    var field_1_neighbours_e = field_1_neighbours["east"];  
    


    
    field_2 =


    var merge_direction;  
    if resizeable8up-handle.hasClass("resizeable8up-n") || resizeable8up-handle.hasClass("resizeable8up-s") {
      merge_direction = vertical;
      if(resizeable8up-handle.hasClass("resizeable8up-n")){
        if(field_1_neighbours_n.length == 1){
          field_2 = "field_" + field_1_neighbours_n;
        }
        else if(field_1_neighbours_n.length > 1) {
          
        }
        else if {    
          
        }
      }
      else if {
        if(field_1_neighbours_s.length == 1) {
          field_2 = "field_" + field_1_neighbours_s;
        }
        else if(field_1_neighbours_s.length > 1) {
          
        }
        else if
      }
        
    }

      
    }
    if resizeable8up-handle.hasClass("resizeable8up-w") || resizeable8up-handle.hasClass("resizeable8up-e") {
      merge_direction = horizontal;
      if(resizeable8up-handle.hasClass("resizeable8up-w")) {
        if(field_1_neighbours_w.length == 1){
          field_2 = "field_" + field_1_neighbours_w;
        }
        else if(field_1_neighbours_w.length > 1) {
          
        }
        else if {

        }
      }
      else if {
        if(field_1_neighbours_e.length == 1) {
          field_2 = "field_" + field_1_neighbours_e;
        }
        else if(field_1_neighbours_e.length > 1) {
        
        }
        else if {

        }
      }  
    }
    
    field_merge(field_1, field_2, merge_direction);
  }
}  


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
		data:{field_to_enlarge : field_2, field_to_delete : field_1, merge_direction : "vertical"} , success: function(data) {}})
    }
  if (merge_direction = "west")
    {
    field_2.width(new_width);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_2, field_to_delete : field_1, merge_direction : "horizontal"} , success: function(data) {}})
}
  if (merge_direction = "south")
    {
    field_1.height(new_height);  
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1, field_to_delete : field_2, merge_direction : "vertical"} , success: function(data) {}})
    }
  if (merge_direction = "east")
    {
    field_1.width(new_width);
      $.ajax({url: "/boards/" + board_id  + 
		"/merge_fields/" +  field_id , type:"POST", 
		data:{field_to_enlarge : field_1, field_to_delete : field_2, merge_direction : "horizontal"} , success: function(data) {}})
    }
}