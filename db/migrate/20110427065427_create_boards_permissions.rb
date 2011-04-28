class CreateBoardsPermissions < ActiveRecord::Migration
  def self.up
    create_table :boards_permissions do |t|
      t.integer :user_id
      t.integer :board_id
      t.string :role

      t.timestamps
    end
  end

  def self.down
    drop_table :boards_permissions
  end
end
