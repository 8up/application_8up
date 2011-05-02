class UsersController < ApplicationController
  # GET /users
  # GET /users.xml

def index
    @users = User.all
    json = ActiveRecord::Base.include_root_in_json
    ActiveRecord::Base.include_root_in_json = false

    respond_to do |format|
      format.html # index.html.erb
      format.json  {
        if params.has_key? :term
    @users = User.find(:all, :conditions=>"email like'%"+params[:term].downcase+"%'")
      user_emails = []
      @users.each do |user| user_emails << user.email end
        render :json => user_emails.to_json  
      else
        render :json => @users.to_json(:only => [:email])
    end }
    end
    ActiveRecord::Base.include_root_in_json = true
  end

  # GET /users/1
  # GET /users/1.xml
  def show
    @user = User.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @user }
    end
  end

  # GET /users/new
  # GET /users/new.xml
  def new
    @user = User.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @user }
    end
  end

  # GET /users/1/edit
  def edit
    @user = User.find(params[:id])
  end

  # POST /users
  # POST /users.xml
  def create
    @user = User.new(params[:user])

    respond_to do |format|
      if @user.save
        format.html { redirect_to(@user, :notice => 'User was successfully created.') }
        format.xml  { render :xml => @user, :status => :created, :location => @user }
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  # PUT /users/1
  # PUT /users/1.xml
  def update
    @user = User.find(params[:id])

    respond_to do |format|
      if @user.update_attributes(params[:user])
        format.html { redirect_to(@user, :notice => 'User was successfully updated.') }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @user.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  # DELETE /users/1.xml
  def destroy
    @user = User.find(params[:id])
    @user.destroy

    respond_to do |format|
      format.html { redirect_to(users_url) }
      format.xml  { head :ok }
    end
  end
  
  def get_online_users
    @users = User.where(["last_request_at > ?", 2.seconds.ago]).all
    render :json => @users.to_json(:only => [:email, :name])
  end
end
