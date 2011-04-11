class Board < ActiveRecord::Base
  has_many :fields
  after_initialize :create_field
  
  def hotness
    rand(4)
  end    
  
  def trashcan
    Note.find(:all, :conditions => ["field_id = ? and trashcan = ?", self.fields, true])

  end


  def create_field
    if fields == []
      puts "foo"
      field = Field.new
      field.position_x = field.position_y = 0
      field.width = field.height = 900
      fields << field
    end
  
  end
    
    def empty_trashcan
      trashcan.each do |note|
        note.destroy
    end      

  end

  end
