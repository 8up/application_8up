class SettingsController < ApplicationController
  
  
  def index
  @hide_toolbox = true
  @hide_addbutton = true
end

  def edit_password

  end

  def change_avatar

  end

  def change_password

  @user = current_user 

  if request.post? 
  #if User.authenticate(@user.username, 
  #  params[:password][:old_password]) == @user 
  
  @user.password = params[:password][:new_password] 
  @user.password_confirmation = 
    params[:password][:new_password_confirmation] 
  
  if @user.save 
    flash[:notice] = 'Your password has been changed' 
      redirect_to :action => 'edit_password' 
else 
    flash[:error] = 'Unable to change your password' 
end 

else 
    flash[:error] = 'Invalid password' 
    end 
  end 
end 
  
#end
