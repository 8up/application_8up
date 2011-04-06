class AddNoteToContent < ActiveRecord::Migration
  def self.up
    add_column :contents, :note_id, :integer
  end

  def self.down
    remove_column :contents, :note_id
  end
end
