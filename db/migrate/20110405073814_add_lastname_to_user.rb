class AddLastnameToUser < ActiveRecord::Migration
  def self.up
    add_column :users, :lastname, :string
  end

  def self.down
    remove_column :users, :lastname
  end
end
