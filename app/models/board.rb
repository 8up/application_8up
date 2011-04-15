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

  ## Tanken är att följande map kommer kunna tala om vilka grannar ett field har
  ## {field_id => {:east => [field_ids], :north => [field_ids], :west => [], :south =>}}
  def get_field_neighbours
    neighbours_map = {}
    self.fields.each do |field|
      neighbours_map[field.id] = {:east => [], :west => [], 
        :north => [], :south => []}
      self.fields.each do |field_2|
        # Hoppa över att jämföra oss med oss själva
        if field == field_2
          next
        end
        
        direction = field.where_is_neighbour(field_2)
        if direction
          neighbours_map[field.id][direction] << field_2.id
        end
         
      end
    end
    
    return neighbours_map
  end
  
  def get_neighbours(field_id)
    all_fields_map = self.get_field_neighbours  
    neighbours_map = all_fields_map[field_id]
    return neighbours_map
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

  def split_field(field, direction)
      attributes = {};
    array_notes_to_add = [];
    attributes[:board_id] = self.id

    if direction == "vertical"
      #Dela fältet vertikalt
      new_width = field.width/2
      field.width = new_width

      #Sätt attribut för det nya fältet efter vertikal split
      attributes[:width] = new_width
      attributes[:height] = field.height
      attributes[:position_x] = field.position_x + new_width
      attributes[:position_y] = field.position_y

      field.notes.each do |note|
        pos_x = note.position_x
        if pos_x >= new_width
          note.position_x -= new_width ## måste subtrahera bredden 
          #eftersom x-positionen är relativ till fieldets x-position
          
          array_notes_to_add << note
        end
      end

      
    else
      #Dela fältet horisontellt
      new_height = field.height/2
      field.height = new_height

      #Sätt attribut för det nya fältet efter horisontell split
      attributes[:height] = new_height
      attributes[:width] = field.width
      attributes[:position_x] = field.position_x
      attributes[:position_y] = field.position_y + new_height
      
      field.notes.each do |note|
        pos_y = note.position_y
        if pos_y >= new_height
          note.position_y -= new_height
          array_notes_to_add << note
        end
      end
    end
    new_field =Field.create(attributes)
    new_field.notes = array_notes_to_add
    
    return new_field
  end

  def merge_fields(field1, field2)
    neighbours = get_neighbours(field1.id)
    
    if neighbours[:west].member? field2.id
      field_to_enlarge = field2
      field_to_delete = field1
      direction = :horizontal
    elsif neighbours[:north].member? field2.id
      field_to_enlarge = field2
      field_to_delete = field1
      direction = :vertical
    elsif neighbours[:east].member? field2.id
      field_to_enlarge = field1
      field_to_delete = field2
      direction = :horizontal
    elsif neighbours[:south].member? field2.id
      field_to_enlarge = field1
      field_to_delete = field2
      direction = :vertical
    else 
      return nil
    end
    
    new_height = field_to_enlarge.height + field_to_delete.height
    new_width = field_to_enlarge.width + field_to_delete.width 

    if direction == :horizontal
        field_to_delete.notes.each do |note|
          new_note_position = field_to_enlarge.width + note.position_x
          note.position_x = new_note_position          
          field_to_enlarge.notes << note
        end
        field_to_enlarge.width = new_width 
    elsif direction == :vertical
        field_to_delete.notes.each do |note|
          new_note_position = field_to_enlarge.height + note.position_y
          note.position_y = new_note_position           
          field_to_enlarge.notes << note
        end
        field_to_enlarge.height = new_height        
    end
    
    field_to_enlarge.save
    field_to_delete.destroy

    return field_to_enlarge
  end
    
  def empty_trashcan
    trashcan.each do |note|
      note.destroy
    end      

  end

end
