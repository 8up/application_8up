class BoardsPermission < ActiveRecord::Base
  OWNER = "Owner"
  PP = "Participants"
  
  
  belongs_to :user
  belongs_to :board
end
