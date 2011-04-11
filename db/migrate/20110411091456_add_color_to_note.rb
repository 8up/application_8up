class AddColorToNote < ActiveRecord::Migration
  def self.up
    add_column :notes, :color, :string
  end

  def self.down
    remove_column :notes, :color
  end
end
