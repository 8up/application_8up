class CreatePlacedAvatars < ActiveRecord::Migration
  def self.up
    create_table :placed_avatars do |t|

      t.timestamps
    end
  end

  def self.down
    drop_table :placed_avatars
  end
end
