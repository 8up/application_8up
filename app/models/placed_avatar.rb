class PlacedAvatar < ActiveRecord::Base
  belongs_to :user
  belongs_to :note
#  validates_uniqueness_of :user_id,:note_id
end
