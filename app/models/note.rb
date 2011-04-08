class Note < ActiveRecord::Base
  belongs_to :field
  has_one :content
  
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
