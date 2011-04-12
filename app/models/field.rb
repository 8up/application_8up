class Field < ActiveRecord::Base
  has_many :notes, :conditions => {:trashcan => false}
  has_many :fields
  belongs_to :board

  def get_coords
    return [[position_x,position_y],[position_x, position_y+height],
            [position_x + width, position_y],[position_x + width, position_y+height]]
  end

end
