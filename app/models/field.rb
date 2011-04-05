class Field < ActiveRecord::Base
  has_many :notes
  has_many :fields
  belongs_to :board
end
