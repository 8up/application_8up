class CreateNotes < ActiveRecord::Migration
  def self.up
    create_table :notes do |t|
      t.string :header
      t.text :body
      t.integer :position_x
      t.integer :position_y
      t.integer :owner_id

      t.timestamps
    end
  end

  def self.down
    drop_table :notes
  end
end
