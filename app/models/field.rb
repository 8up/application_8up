class Field < ActiveRecord::Base
  has_many :notes, :conditions => {:trashcan => false}
  has_many :fields
  belongs_to :board
end
