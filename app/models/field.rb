# -*- coding: utf-8 -*-
class Field < ActiveRecord::Base
  has_many :notes, :conditions => {:trashcan => false}
  has_many :fields
  belongs_to :board

  def get_coords
    {:top_left =>  {:x => position_x, :y => position_y} ,
      :top_right => {:x => position_x + width, :y => position_y},
      :bottom_left => {:x => position_x, :y => position_y + height},
      :bottom_right => {:x => position_x + width, :y => position_y + height},
      :bottom => position_y + height,
      :top => position_y,
      :left => position_x,
      :right => position_x + width
    }
    
    #return [[position_x,position_y],[position_x, position_y+height],
    #        [position_x + width, position_y],[position_x + width, position_y+height]]
  end
  
  def where_is_neighbour field
    my = self.get_coords
    your = field.get_coords
    
    ## Om du är min granne norrut
    if my[:top] == your[:bottom]
      if (my[:left] < your[:left] and my[:right] > your[:left]) or
          (my[:left] < your[:right] and my[:right] > your[:right]) or
          (my[:left] >= your[:left] and my[:right] <= your[:right])
        return :north
      end
    end
    ## Om du är min granne söderut
    if my[:bottom] == your[:top]
      if (my[:left] < your[:left] and my[:right] > your[:left]) or
          (my[:left] < your[:right] and my[:right] > your[:right]) or
          (my[:left] >= your[:left] and my[:right] <= your[:right])
        return :south
      end
    end
    # Om du är min granne västerut
    if my[:left] == your[:right]
      if (my[:top] < your[:bottom] and my[:bottom] > your[:bottom]) or
          (my[:top] < your[:top] and my[:bottom] > your[:top]) or
          (my[:top] >= your[:top] and my[:bottom] <= your[:bottom])
        return :west
      end
    end    

    # Om du är min granne österut
    if my[:right] == your[:left]
      if (my[:top] < your[:bottom] and my[:bottom] > your[:bottom]) or
          (my[:top] < your[:top] and my[:bottom] > your[:top]) or
          (my[:top] >= your[:top] and my[:bottom] <= your[:bottom])
        return :east
      end
    end    

    return nil
  end
end
