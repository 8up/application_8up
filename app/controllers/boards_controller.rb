# -*- coding: utf-8 -*-
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
      format.json  { render :json => @board }
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
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @board.errors, :status => :unprocessable_entity }
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
    
    new_field = @board.split_field(@field, params[:split_direction])

    if @field.save and new_field.save
      respond_to do |format|
        format.json { render :json => new_field }
      end
    end
  end

  def merge_fields
    @board = Board.find(params[:board_id])
    field_to_enlarge = Field.find(params[:field_to_enlarge])
    field_to_delete = Field.find(params[:field_to_delete])
    
    remaining_field = @board.merge_fields(field_to_enlarge, field_to_delete)

    respond_to do |format|
      format.json { render :json => remaining_field }
    end

  end

  def resize_field
    @field = Field.find params[:field_id]
    @board = Board.find params[:board_id]

    updated_fields = @board.resize_field(@field, params)

    respond_to do |format|
        format.json { render :json => updated_fields }
    end
  end
  
  def invite
    @user = User.find params[:user_id]
    @board = Board.find params[:board_id]
    
    authorize! :invite, @board
    if    @board.set_permission(@user,BoardsPermission::PP)
      render :json => {:status => 'ok'}
    else
      render :json => {:status => 'Could not invite'}
    end
    
    
  end
end
