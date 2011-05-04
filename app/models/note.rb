# == Schema Information
# Schema version: 20110429131040
#
# Table name: notes
#
#  id         :integer         not null, primary key
#  header     :string(255)
#  body       :text
#  position_x :integer
#  position_y :integer
#  owner_id   :integer
#  created_at :datetime
#  updated_at :datetime
#  field_id   :integer
#  trashcan   :boolean
#  color      :string(255)
#

class Note < ActiveRecord::Base
  belongs_to :field
  has_one :content
  has_many :placed_avatars
  
  def move_to_trash
    self.trashcan = true
  end
  
  def recover_from_trash
    self.trashcan = false
  end
  
  def after_initialize
    if self.trashcan == nil
      self.trashcan = false
    end
  end 
  
  def belongs_to_board board
    field.board.id == board.id
  end
  
end
