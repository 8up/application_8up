$(document).ready(function () {  
setInterval(update_online_list, 1000);

function update_online_list(){
  var user_list = $("#online_user_list");
   $.ajax({
            url: '/online_users.json',
            type: 'GET',
            success: function(data, textStatus, jqXHR){
              user_list.text(" ");
              var text;
              for(var i = 0; i < data.length; i++){
               user_list.append(data[i].user.name + "<br>");
            }

            }
          });
        };
        });