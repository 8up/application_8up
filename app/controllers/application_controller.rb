class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :authenticate_user!, :set_last_request_at
 # before_filter :set_last_request_at
  layout(:get_layout_name)
  
  def get_layout_name
    if devise_controller? && action_name != 'edit'
      "log_in"
    else
      "application"
    end
  end
  
  def set_last_request_at
    current_user.update_attribute(:last_request_at, Time.now) if
    user_signed_in?
  end
   
end
