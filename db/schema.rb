# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110426080754) do

  create_table "boards", :force => true do |t|
    t.string   "name"
    t.integer  "owner_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "in_trash"
  end

  create_table "ckeditor_assets", :force => true do |t|
    t.string   "data_file_name",                                 :null => false
    t.string   "data_content_type"
    t.integer  "data_file_size"
    t.integer  "assetable_id"
    t.string   "assetable_type",    :limit => 30
    t.string   "type",              :limit => 25
    t.string   "guid",              :limit => 10
    t.integer  "locale",            :limit => 1,  :default => 0
    t.integer  "user_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "ckeditor_assets", ["assetable_type", "assetable_id"], :name => "fk_assetable"
  add_index "ckeditor_assets", ["assetable_type", "type", "assetable_id"], :name => "idx_assetable_type"
  add_index "ckeditor_assets", ["user_id"], :name => "fk_user"

  create_table "contents", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "note_id"
  end

  create_table "fields", :force => true do |t|
    t.string   "name"
    t.string   "color"
    t.integer  "position_x"
    t.integer  "position_y"
    t.integer  "width"
    t.integer  "height"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "board_id"
  end

  create_table "notes", :force => true do |t|
    t.string   "header"
    t.text     "body"
    t.integer  "position_x"
    t.integer  "position_y"
    t.integer  "owner_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "field_id"
    t.boolean  "trashcan"
    t.string   "color"
  end

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "email",                                 :default => "", :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "lastname"
    t.string   "encrypted_password",     :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                         :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

end
