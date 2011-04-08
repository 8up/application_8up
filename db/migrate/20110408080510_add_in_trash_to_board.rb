class AddInTrashToBoard < ActiveRecord::Migration
  def self.up
    add_column :boards, :in_trash, :boolean
  end

  def self.down
    remove_column :boards, :in_trash
  end
end
