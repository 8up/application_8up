class AddBoardToFields < ActiveRecord::Migration
  def self.up
    add_column :fields, :board_id, :integer
  end

  def self.down
    remove_column :fields, :board_id
  end
end
