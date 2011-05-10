# -*- coding: utf-8 -*-
require 'pusher'
Pusher.app_id = '5364'
Pusher.key = '83cad248adce476e852e'
Pusher.secret = '1dea4f02257881216844'

class BoardsController < ApplicationController
  #load_resource :find_by => :owner_id
  #authorize_resource
  
  
  # GET /boards
  # GET /boards.xml
  def index
    @boards = current_user.boards

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @boards }
    end
  end
  
  # GET /boards/1
  # GET /boards/1.xml
  # GET /boards/1.json
  def show
    @board = Board.find(params[:id])
    
    authorize! :show, @board
    
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @board }
      format.json  { render :json => @board.to_json(
        :methods => [:owner_name], 
        :include => {
          :participants => {
            :only => [:name]}}) }
    end
  end

  # GET /boards/new
  # GET /boards/new.xml
  def new
    @board = Board.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @board }
    end
  end

  # GET /boards/1/edit
  def edit
    @board = Board.find(params[:id])
  end

  # POST /boards
  # POST /boards.xml
  def create
    @board = Board.new(params[:board])
    @board.set_permission(current_user,BoardsPermission::OWNER)    

    respond_to do |format|
      if @board.save
        format.html { redirect_to(@board, :notice => 'Board was successfully created.') }
        format.xml  { render :xml => @board, :status => :created, :location => @board }
        format.json { render :json => @board, :status => :created, :location => @board }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @board.errors, :status => :unprocessable_entity }
        format.json { render :json => @board.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /boards/1
  # PUT /boards/1.xml
  def update
    @board = Board.find(params[:id])

    respond_to do |format|
      if @board.update_attributes(params[:board])
        format.html { redirect_to(@board, :notice => 'Board was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @board.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /boards/1
  # DELETE /boards/1.xml
  def destroy
    # @board = Board.find(params[:id])
    # @board.destroy

    # respond_to do |format|
    #   format.html { redirect_to(boards_url) }
    #   format.xml  { head :ok }
    # end
    @board = Board.find(params[:id])
    @board.move_to_trash
    if @board.save
      respond_to do |format|
        format.json { render :json => {:status => 'ok'}}
      end
    end
  end

  def split_field
    @board = Board.find(params[:board_id])
    @field = Field.find(params[:field_id])
    
    new_field = @board.split_field(@field, params[:split_direction], 
                                   params[:split_position].to_i)
    
    update_success = @field.save and new_field.save

    @board.reload

    updated_fields = @board.get_field_neighbours
    data = {:neighbours_map => updated_fields, 
      :new_field => new_field}
    
    fields = @board.fields
    for field in fields
      field[:neighbours] = updated_fields[field.id]
    end

    pusher_data = {
      :fields => fields,
      :notes => new_field.notes,
      :new_field => new_field
    }

    if update_success
      publish_to_faye("/board/#{@board.id}", pusher_data, "field-split")
      #Pusher["board-#{@board.id}"].trigger!('split-field', pusher_data)
      
      respond_to do |format|
        format.json { render :json => data}
      end
    end
  end

  def merge_fields
    @board = Board.find(params[:board_id])
    field_to_enlarge = Field.find(params[:field_to_enlarge])
    field_to_delete = Field.find(params[:field_to_delete])
    
    result = 
      @board.merge_fields(field_to_enlarge, field_to_delete)
    update_success = result[:remaining].save
    @board.reload
    updated_fields = @board.get_field_neighbours
    fields = @board.fields
    for field in fields
      field[:neighbours] = updated_fields[field.id]
    end

    pusher_data = {
      :fields => fields,
      :result => result
    }
    
    if update_success
      publish_to_faye("/board/#{@board.id}", pusher_data, "field-merge")
      #Pusher["board-#{@board.id}"].trigger!('merge-field', pusher_data)
      respond_to do |format|
        format.json { render :json => pusher_data }
      end
    end

  end

  def resize_field
    @field = Field.find params[:field_id]
    @board = Board.find params[:board_id]

    @board.resize_field(@field, params)
    updated_fields = @board.get_field_neighbours

    fields = @board.fields
    for field in fields
      field[:neighbours] = updated_fields[field.id]
    end

    pusher_data = {
      :fields => fields,
    }
    publish_to_faye("/board/#{@board.id}", pusher_data, "field-resize")
    #Pusher["board-#{@board.id}"].trigger!('resize-field', pusher_data )
    respond_to do |format|
      format.json { render :json => { :status => "ok"} }
    end
  end
  
  def invite  
    @user = User.find_by_email params[:email]
    @board = Board.find params[:board_id]
    
    if(@board.nil?)
      render :json => {:status => '404'}, :status => 404
    elsif(@user.nil?)
      render :json => {:status => 'error', :message => 'Could not find user'}
    elsif(@board.participants.exists?(@user))
      render :json => {:status => 'error', :message => 'Already invited'}
    elsif( @board.owner == @user)
      render :json => {:status => 'error', :message => 'You fucking own this board!'}
    else
      authorize! :invite, @board
      if    @board.set_permission(@user,BoardsPermission::PP)
        render :json => {:status => 'ok', :message => ''}
      else
        render :json => {:status => 'error', :message => 'Could not invite user'}
      end
    end
    
  end
end
