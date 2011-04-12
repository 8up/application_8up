# -*- coding: utf-8 -*-
class Board < ActiveRecord::Base
  has_many :fields
  after_initialize :create_field
  
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
  
  ## Returnerar en hashmap av hashmaps där den yttre har x-koordinater som
  ## nycklar och den inre y-koordinater. Den inres värden är arrayer med
  ## de fält-id:n som koordinaten delar, ex: fields_map[x][y] -> [field_id]
  def get_corners
    fields_map = {}
    self.fields.each do |field|
      coords = field.get_coords
      coords.each do |coord|
        if not fields_map.has_key? coord.first
          fields_map[coord.first] = {}
        end
        
        if fields_map[coord.first].has_key? coord.last
          fields_map[coord.first][coord.last].push(field.id)
        else
          fields_map[coord.first][coord.last] = [field.id] 
        end
      end
    end
    return fields_map
  end

  def create_field
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
    trashcan.each do |note|
      note.destroy
  end      

  end

  end
