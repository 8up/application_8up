function color_palette_handler(e) {
    		var x = $(e.target).attr("data-color");
    
    		$(".selected.note").each(function(index, domElement){
    			var note_id = $(domElement).attr('id').split('_').pop();
    			var board_id = $(domElement).data('board_id').split('_').pop();
    			var url_path =  "/boards/" + board_id + "/notes/" + 
    			    note_id + '.json';
    			var old_color = $(domElement).css('background-color');
    			$(domElement).css('background-image', 'url(\'' + x + '\')');
    			$.ajax({ url: url_path, 
    				    type: 'POST',
    				    data: {_method:'PUT',
    					'note[color]': x.replace('_select', '') 	},
    				    error: function(){
    				    // Om vi får error sätter vi tillbaka gamla färgen
    				    //$(domElement).css('background-color', old_color);

    				}});   
    		    });
    };
