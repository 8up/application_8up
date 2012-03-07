class ApplicationController < ActionController::Base
  protect_from_forgery
  before_filter :set_faye_params, :authenticate_user!, :set_last_request_at
 # before_filter :set_last_request_at
  layout(:get_layout_name)
   
  def set_faye_params
    @faye_adress = "109.74.7.174"
    # @faye_adress = "localhost"
    @faye_port = "9292"
  end
  def get_layout_name
        if devise_controller? && action_name != 'edit' && action_name != 'update'
      "log_in"
    else
      "application"
    end
  end
  
  def set_last_request_at
    current_user.update_attribute(:last_request_at, Time.now) if
    user_signed_in?
  end

  def publish_to_faye(channel, data, action)
    faye_url = "http://#{@faye_adress}:#{@faye_port}/faye"
    #faye_url = "http://localhost:9292/faye"
    message = {:channel => channel, :data => {:action => action, :data => data} }
    uri = URI.parse(faye_url)  
    Net::HTTP.post_form(uri, :message => message.to_json) 
  end
   
end
