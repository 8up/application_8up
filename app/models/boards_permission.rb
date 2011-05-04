# == Schema Information
# Schema version: 20110429131040
#
# Table name: boards_permissions
#
#  id         :integer         not null, primary key
#  user_id    :integer
#  board_id   :integer
#  role       :string(255)
#  created_at :datetime
#  updated_at :datetime
#

class BoardsPermission < ActiveRecord::Base
  OWNER = "Owner"
  PP = "Participants"
  
  
  belongs_to :user
  belongs_to :board
end
