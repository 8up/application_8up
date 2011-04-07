class Board < ActiveRecord::Base
  has_many :fields
  def hotness
    rand(4)
  end    
  
  def trashcan
    Note.find(:all, :conditions => ["field_id = ? and trashcan = ?", self.fields, true])

  end


  def after_initialize
    if fields == []
      puts "foo"
      field = Field.new
      field.position_x = field.position_y = 0
      field.width = field.height = 900
      fields << field
    end
  end

end
