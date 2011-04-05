class AddFieldToNotes < ActiveRecord::Migration
  def self.up
    add_column :notes, :field_id, :integer
  end

  def self.down
    remove_column :notes, :field_id
  end
end
