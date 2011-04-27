module ApplicationHelper
  
  def show_toolbox
    if @hide_toolbox 
      "style='display:none'"
    else  
      ""
    end
  end
  
  def show_addbutton
    if @hide_addbutton 
      "style='display:none'"
    else  
      ""
    end
  end
  
end
