# == Schema Information
# Schema version: 20110429131040
#
# Table name: placed_avatars
#
#  id         :integer         not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  user_id    :integer
#  note_id    :integer
#

class PlacedAvatar < ActiveRecord::Base
  belongs_to :user
  belongs_to :note
#  validates_uniqueness_of :user_id,:note_id
end
