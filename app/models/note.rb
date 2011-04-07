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
    self.trashcan = false
  
  def belongs_to_board board_id
    field.board.id == board_id
  end
  
end
