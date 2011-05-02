# -*- coding: utf-8 -*-
class Board < ActiveRecord::Base
  has_many :boards_permissions
  has_one :owner, :through => :boards_permissions, :source => :user, :conditions => { "boards_permissions.role" => BoardsPermission::OWNER }
  has_many :participants, :through => :boards_permissions, :source => :user, :conditions => { "boards_permissions.role" => BoardsPermission::PP}
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
  
  def owner_name
    owner.name
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
    new_field = Field.create(attributes)
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

  ## Ändra storlek på ett fält. Resize params är en hash-map med nycklarna
  ## :direction och :delta. Delta är värdet baserat på vilken positionsförändring
  ## en resize orsakar, dvs upp på skärmen ger ett negativt y-värde, 
  ## nedåt ett positivt. Förändring åt vänster ger ett negativt x-värde, åt höger
  ## ett positivt
  def resize_field(field, resize_params)
    resize_map = build_resize_map(field, resize_params)
    delta = resize_params[:delta].to_i
    direction = resize_params[:direction].to_sym

    
    ## ändra storlek på alla fält som är på samma sida som orginalfältet
    for field_id in resize_map[:original_side]
    
      f = Field.find field_id
      if direction ==  :north
        ## ändra position_y samt heigh
        f.height -= delta
        f.position_y += delta
      elsif direction == :south
        f.height += delta
      elsif direction == :east
        f.width += delta
      elsif direction == :west
        f.width -= delta
        f.position_x += delta
      end
      f.save
    end

    ## ändra storlek på de fält som är på motsatt sida om delnings-linjen som
    ## orginalfältet
    for field_id in resize_map[:other_side]
    
      f = Field.find field_id
      if direction ==  :north
        f.height += delta
      elsif direction == :south
        f.position_y += delta
        f.height -= delta
      elsif direction == :east
        f.position_x += delta
        f.width -= delta
      elsif direction == :west
        f.width += delta
      end
      f.save
    end
    
    self.save
    self.fields.reload

   return resize_map
  end
  
  ## Bygger upp den hash-map som används för att ändra storlek på fält
  def build_resize_map(field, resize_params)
    require 'set'

    neighbours_map = self.get_field_neighbours
    
    ## Direction är den rikting storleksförändringen sker åt i förhållande
    ## till orginal-fältet
    direction = resize_params[:direction].to_sym

    ## reverse direction är den omvända riktingen för fält på andra sidan den 
    ## delning som flyttas på
    reverse_direction = nil
    if direction ==  :north
      reverse_direction = :south
    elsif direction == :east
      reverse_direction = :west
    elsif direction == :south
      reverse_direction = :north
    elsif direction == :west
      reverse_direction = :east
    end

    
    ## Två maps som används i algoritmen, original side är den side vi börjar på,
    ## dvs den sida som orginal-fältet är på
    ## Other side är andra sidan
    ## to_resize_map samlar på sig de fält som skall förstoras/förminskas
    ## to_visit håller reda på vilka fält som skall undersökas en iteration
    ## visited är en mängd med redan besökta fält
    to_resize_map = {:original_side => Set.new, :other_side => Set.new}
    to_visit = Set.new
    visited = Set.new

    ## Vi börjar initiera genom att gå igenom orginal-fältets grannar i 
    ## Den riktning som skall resizeas och lägger in dem i to_visit-mängden
    for other_field in neighbours_map[field.id][direction]
      ## Lägg bara till de fält vi ännu inte undersökt
      to_visit << other_field
    end

    visited << field.id
    to_resize_map[:original_side] << field.id

    ## Vi sätter variablerna som håller reda på vilken sida vi är på
    current_side = :other_side
    current_direction = reverse_direction
    
    while to_visit.length > 0
      to_visit_on_other_side = Set.new

      for current_field in to_visit
        ## Vi kollar grannarna på motsatt sida om de redan undersökts,
        ## annars läggs de till i den nya to_visit-mängden
        for neighbour in neighbours_map[current_field][current_direction]
          ## vi lägger bara till fältet om vi inte redan besökt det
          if not visited.member? neighbour
            to_visit_on_other_side << neighbour
          end
        end
        
        to_resize_map[current_side] << current_field
        visited << current_field
      end

      ## uppdatera to_visit för nästa varv i loopen
      to_visit = to_visit_on_other_side

      ## byt riktning med ternary if-sats
      current_direction = (current_direction == direction ? 
                           reverse_direction : direction)
      ## byt sida med ternary if
      current_side = (current_side == :original_side ? 
                      :other_side : :original_side)
    end
      
    return to_resize_map
  end
    
    
  def empty_trashcan
    trashcan.each do |note|
      note.destroy
    end      

  end
  
  def set_permission(user, permission)
    boards_permission = BoardsPermission.new
    boards_permission.user = user
    boards_permission.role = permission
    boards_permission.board = self
    boards_permission.save
  end

end
