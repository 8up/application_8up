class User < ActiveRecord::Base
has_many :notes, :field => :owner_id

end
