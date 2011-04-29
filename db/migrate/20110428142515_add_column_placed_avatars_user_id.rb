class AddColumnPlacedAvatarsUserId < ActiveRecord::Migration
  def self.up
    add_column :placed_avatars, :user_id, :integer
    add_column :placed_avatars, :note_id, :integer    
  end

  def self.down
    
    remove_column :placed_avatars, :user_id, :integer
    remove_column :placed_avatars, :note_id, :integer
  end
end
