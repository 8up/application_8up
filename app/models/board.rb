class Board < ActiveRecord::Base
  has_many :fields

  def hotness
    rand(4)
  end

end
