class User < ActiveRecord::Base
has_many :notes, :foreign_key => :owner_id

end
