Application8up::Application.routes.draw do
  devise_for :users

  resources :fields

  resources :notes do
    get 'content'
   end
  
  resources :users
  resources :contents

  
  
  resources :boards do
    resources :notes do
      delete 'destroy'
      member do
        get 'content'
      end
    end
    resources :fields
    

  end
  match "/online_users", :controller => "users", :action => "get_online_users"
  
  match "/boards/:board_id/split_field/:field_id", :controller => "boards", :action => "split_field", :via => "post"

  match "/boards/:board_id/merge_fields/:field_id", :controller => "boards", :action => "merge_fields", :via => "post"

  match "/boards/:board_id/resize_field/:field_id", :controller => "boards", :action => "resize_field", :via => "post"
  match "/boards/:board_id/invite/", :controller => "boards", :action => 'invite'#, :via => 'post'

  match "/settings", :controller => "settings", :action => "index"

  match "/settings/change_password/", :controller => "settings", :action => "change_password"
  match "/settings/edit_password/", :controller => "settings", :action => "edit_password"
  match "/settings/change_avatar/", :controller => "settings", :action => "change_avatar"

  root :to => "boards#index"

end
