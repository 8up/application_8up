class CreateFields < ActiveRecord::Migration
  def self.up
    create_table :fields do |t|
      t.string :name
      t.string :color
      t.integer :position_x
      t.integer :position_y
      t.integer :width
      t.integer :height

      t.timestamps
    end
  end

  def self.down
    drop_table :fields
  end
end
