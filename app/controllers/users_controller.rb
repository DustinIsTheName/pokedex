class UsersController < ApplicationController
  before_action :set_use, only: [:show, :edit, :update, :destroy]

  def index
  end

  def show
    
  end

  def new
  end

  def create
  end

  def edit
  end

  def update
  end

  def destroy
  end

  private

    def set_use
      @user = User.find(params[:id])
    end

end
