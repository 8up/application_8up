class RemoveColoumnBoardsOwnerId < ActiveRecord::Migration
  def self.up

    remove_column :boards, :owner_id

  end

  def self.down
  end
end
