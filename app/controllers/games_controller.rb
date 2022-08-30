class GamesController < ApplicationController
  before_action :authenticate_user!, only: %i[ index show new edit update destroy ]
  before_action :set_game, only: %i[ show edit update destroy ]
  before_action :own_game, only: %i[ show edit update destroy ]

  # GET /games or /games.json
  def index
    @games = Game.where(user: current_user).order(id: :desc)
  end

  # GET /games/1 or /games/1.json
  def show
    @cards_done = @game.cards_done.sort_by(&:done_at).reverse
    @cards_in_table = @game.cards
    @actions = @game.cards.map(&:action)

    if (!params[:player].nil? && !params[:player].empty?)
      @cards_in_table = @cards_in_table.where('player = ? OR target = ?', params[:player], params[:player])
    end

    if (!params[:card_action].nil? && !params[:card_action].empty?)
      @cards_in_table = @cards_in_table.where(action: params[:card_action])
    end
  end

  # GET /games/1/dashboard
  def dashboard
    @game = Game.includes(:cards).find_by(token: params[:token])
    return render file: "#{Rails.root}/public/404.html" , status: :not_found unless @game

    saw_game @game.token

    @cards_done = @game.cards_done.sort_by(&:done_at).reverse
  end

  # GET /games/new
  def new
    @game = Game.new
    @game.name = "Anniversaire"
    @game.players = I18n.t('game.default_fields.players').join("\n")
    @game.actions = I18n.t('game.default_fields.actions').join("\n")
    @game.target_action_preferences = I18n.t('game.default_fields.target_action_preferences').join("\n")
  end

  # GET /games/1/edit
  def edit
  end

  # POST /games or /games.json
  def create
    @game = Game.new(game_params)
    @game.user = current_user

    respond_to do |format|
      if @game.save
        format.html { redirect_to game_url(@game), notice: t('.success') }
        format.json { render :show, status: :created, location: @game }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /games/1 or /games/1.json
  def update
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to game_url(@game), notice: "Game was successfully updated." }
        format.json { render :show, status: :ok, location: @game }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1 or /games/1.json
  def destroy
    @game.destroy

    respond_to do |format|
      format.html { redirect_to games_url, notice: "Game was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.includes(:cards).find(params[:id])
      @players = @game.get_players_list
      @actions = @game.get_actions_list
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:name, :players, :actions, :target_action_preferences)
    end

    def own_game
      if @game.user_id != current_user.id
        flash.alert = "Vous n'avez pas accès a ce jeu!"
        redirect_back(fallback_location: root_path)
      end
    end
end
