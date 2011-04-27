class SetUpBoardsPermissions < ActiveRecord::Migration
  def self.up
    boards = Board.find :all
    boards.each do |board|
      if board.owner_id == nil
        board.destroy
      else
        boards_permissions = BoardsPermission.new
        boards_permissions.user = User.find board.owner_id
        boards_permissions.role = "Owner"
        boards_permissions.board = board
        boards_permissions.save
      end
    end
    
    
    
  end

  def self.down
  end
end
