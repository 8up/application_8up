class NotesController < ApplicationController
  # GET /notes
  # GET /notes.xml
  def index
    @notes = Note.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @notes }
    end
  end

  # GET /notes/1
  # GET /notes/1.xml
  def show
    @note = Note.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @note }
    end
  end

  # GET /notes/new
  # GET /notes/new.xml
  def new
    @note = Note.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @note }
    end
  end

  # GET /notes/1/edit
  def edit
    @note = Note.find(params[:id])
  end

  # POST /notes
  # POST /notes.xml
  # Post /notes.json
  def create
    @note = Note.new(params[:note])
    
    respond_to do |format|
      if @note.save
        field = Field.find(@note.field_id)
        board = Board.find(field.board_id)
        @note[:board_id] = board.id
        format.json { render :json =>  @note }

        format.html { redirect_to(@note, :notice => 'Note was successfully created.') }
        format.xml  { render :xml => @note, :status => :created, :location => @note }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @note.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /notes/1
  # PUT /notes/1.xml
  def update
    @note = Note.find(params[:id])

    respond_to do |format|
      if @note.update_attributes(params[:note])
        format.html { redirect_to(@note, :notice => 'Note was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @note.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /notes/1
  # DELETE /notes/1.xml
  def destroy
    # @note = Note.find(params[:id])
    # @note.destroy

    # respond_to do |format|
    #   format.html { redirect_to(notes_url) }
    #   format.xml  { head :ok }
    # end
    
    @note = Note.find(params[:id])
    @note.move_to_trash
    if @note.save
      respond_to do |format|
        format.json { render :json => { :status => 'ok'} }
      end
    end

  end
  
  # DELETE /notes/1
  def trash
    @note = Note.find(params[:id])
    @note.move_to_trash
    
    respond_to do |format|
      render :json => { :status=>'ok'}
    end
  end

  def content
    @note = Note.find(params[:note_id])
    @board = Board.find(params[:board_id])
    
    if not @note.belongs_to_board @board     
		render :json => {:body => "foo not found"}, :status => 404
    else
      respond_to do |format|
        format.xml  { render :xml => @note } 
        format.json { render :json => @note }
      end
    end
  end
end
