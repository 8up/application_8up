class Note < ActiveRecord::Base
  belongs_to :field
  
  def move_to_trash
    self.trashcan = true
  end
  
  def recover_from_trash
    self.trashcan = false
  end
  
end
