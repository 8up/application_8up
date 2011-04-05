class AddTrashcanToNote < ActiveRecord::Migration
  def self.up
    add_column :notes, :trashcan, :boolean
  end

  def self.down
    remove_column :notes, :trashcan
  end
end
