class Board < ActiveRecord::Base
  has_many :fields
  
  def hotness
    rand(4)
  end
  
  
  def trashcan
  Note.find(:all, :conditions => ["field_id = ? and trashcan = ?", self.fields, true])

  end

end
