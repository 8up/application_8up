# -*- coding: utf-8 -*-
class BoardsController < ApplicationController
  # GET /boards
  # GET /boards.xml
  def index
    @boards = Board.all

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
    attributes = {};
    array_notes_to_add = [];
    attributes[:board_id] = @field.board_id

    if params[:split_direction] == "vertical"
      #Dela fältet vertikalt
      new_width = @field.width/2
      @field.width = new_width

      #Sätt attribut för det nya fältet efter vertikal split
      attributes[:width] = new_width
      attributes[:height] = @field.height
      attributes[:position_x] = @field.position_x + new_width
      attributes[:position_y] = @field.position_y

      @field.notes.each do |note|
        pos_x = note.position_x
        if pos_x >= new_width
          note.position_x -= new_width ## måste subtrahera bredden 
          #eftersom x-positionen är relativ till fieldets x-position
          
          array_notes_to_add << note
        end
      end

      
    else
      #Dela fältet horisontellt
      new_height = @field.height/2
      @field.height = new_height

      #Sätt attribut för det nya fältet efter horisontell split
      attributes[:height] = new_height
      attributes[:width] = @field.width
      attributes[:position_x] = @field.position_x
      attributes[:position_y] = @field.position_y + new_height
      
      @field.notes.each do |note|
        pos_y = note.position_y
        if pos_y >= new_height
          note.position_y -= new_height
          array_notes_to_add << note
        end
      end
    end
    new_field =Field.create(attributes)
    new_field.notes = array_notes_to_add

    if @field.save and new_field.save
      respond_to do |format|
        format.json { render :json => new_field }
      end
    end
  end

  def merge_fields
    @board = Board.find(params[:board_id])
    @field_to_enlarge = Field.find(params[:field_to_enlarge])
    @field_to_delete = Field.find(params[:field_to_delete])
    
    attributes = {};
    
    new_height = @field_to_enlarge.height + @field_to_delete.height
    new_width = @field_to_enlarge.width + @field_to_delete.width 

    if params[:merge_direction] == "width"
        @field_to_delete.notes.each do |note|
          new_note_position = @field_to_enlarge.width + note.position_x
          note.position_x = new_note_position          
          @field_to_enlarge.notes << note
        end
        @field_to_enlarge.width = new_width 
    end

    if params[:merge_direction] == "height"
        @field_to_delete.notes.each do |note|
          new_note_position = @field_to_enlarge.height + note.position_y
          note.position_y = new_note_position           
          @field_to_enlarge.notes << note
        end
        @field_to_enlarge.height = new_height        
    end

    attributes[:height] = new_height
    attributes[:width] = new_width
    @field_to_enlarge.update_attributes(attributes)
    
    Field.delete(params[:field_to_delete])

    respond_to do |format|
        format.json { render :json => @field_to_enlarge }
    end

  end

  def resize_field
    @field = Field.find params[:field_id]
    @board = Board.find params[:board_id]
    
    neighbours_map = @board.get_field_neighbours
    
    neighbours = neighbours_map[@field.id]
    

    respond_to do |format|
        format.json { render :json => neighbours }
    end
  end
end
