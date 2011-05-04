# == Schema Information
# Schema version: 20110429131040
#
# Table name: contents
#
#  id         :integer         not null, primary key
#  created_at :datetime
#  updated_at :datetime
#  note_id    :integer
#

class Content < ActiveRecord::Base
  belongs_to :note

  end
