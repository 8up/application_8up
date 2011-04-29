class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :encryptable, :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  validates_presence_of :name
  attr_accessible :name, :email, :password, :password_confirmation, :remember_me
  has_many :notes, :foreign_key => :owner_id
  has_many :boards, :foreign_key => :owner_id
  has_many :placed_avatars
end
