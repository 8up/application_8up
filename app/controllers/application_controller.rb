class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authenticate_user!
  layout(:get_layout_name)
  
  def get_layout_name
    if devise_controller?
      "log_in"
    else
      "application"
    end
  end
   
end
