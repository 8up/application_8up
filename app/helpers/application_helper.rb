module ApplicationHelper
  
  def show_toolbox
    if @hide_toolbox 
      "style='display:hidden'"
    else  
      ""
    end
  end
  
end
