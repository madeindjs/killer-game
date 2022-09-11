class PlayersController < ApplicationController
  before_action :set_player, only: %i[ show edit update destroy ]
  before_action :set_game


  # GET /players or /players.json
  def index
    @players = @game.players
    @player = Player.new
    @player.game = @game

    if Rails.env.development?
      @player.name = Time.now.to_s
      @player.email = "#{Time.now.to_i}@test.fr"
    end
  end

  # GET /players/1 or /players/1.json
  def show
  end

  # GET /players/new
  def new
    @player = Player.new
    @player.game = @game

    if Rails.env.development?
      @player.name = Time.now.to_s
    end
  end

  # GET /players/1/edit
  def edit
  end

  # POST /players or /players.json
  def create
    @player = Player.new(player_params)
    @player.game = @game

    respond_to do |format|
      if @player.save
        format.html { redirect_to game_players_url(game_id: @player.game_id), notice: "Player was successfully created." }
        format.json { render :show, status: :created, location: @player }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @player.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /players/1 or /players/1.json
  def update
    respond_to do |format|
      if @player.update(player_params)
        format.html { redirect_to game_players_url(game_id: @player.game_id), notice: "Player was successfully updated." }
        format.json { render :show, status: :ok, location: @player }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @player.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /players/1 or /players/1.json
  def destroy
    @player.destroy

    respond_to do |format|
      format.html { redirect_to game_players_url(game_id: @player.game_id), notice: "Player was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_player
      @player = Player.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def player_params
      params.require(:player).permit(:name, :description, :email)
    end

    def set_game
      @game = Game.find params[:game_id]

      if @game.user_id != current_user&.id
        flash.alert = "Vous n'avez pas accès a ce jeu!"
        redirect_back(fallback_location: root_path)
      end
    end

    def own_game
      if @game.user_id != current_user&.id
        flash.alert = "Vous n'avez pas accès a ce jeu!"
        Rails.logger.info "User #{@game.user_id} cannot see game #{game.id}"
        redirect_back(fallback_location: root_path)
      end
    end
end