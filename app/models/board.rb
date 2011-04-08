class Board < ActiveRecord::Base
  has_many :fields
  def hotness
    rand(4)
  end    
  
  def trashcan
    Note.find(:all, :conditions => ["field_id = ? and trashcan = ?", self.fields, true])
  end

  def move_to_trash
    self.in_trash = true
    self.save
  end

  def recover_from_trash
    self.in_trash = false
    self.save
  end

  def after_initialize
    if self.in_trash == nil
      self.in_trash = false
    end
    if fields == []
      puts "foo"
      field = Field.new
      field.position_x = field.position_y = 0
      field.width = field.height = 900
      fields << field
    end
  
  end
    
    def empty_trashcan
      t.each do |note|
        note.destroy
    end      

  end

  end
