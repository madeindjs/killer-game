class GamesController < ApplicationController
  before_action :authenticate_user!, only: %i[ index show new edit update destroy ]
  before_action :set_game, only: %i[ show edit update destroy ]

  # GET /games or /games.json
  def index
    authorize Game
    @games = Game.where(user: current_user).order(id: :desc)
  end

  # GET /games/1 or /games/1.json
  def show
    authorize @game
    @cards_done = @game.cards_done.sort_by(&:done_at).reverse

    @players = @game.players
    @player = Player.new
    @player.game = @game

    if Rails.env.development?
      @player.name = Faker::Name.name
      @player.email = Faker::Internet.email
    end
    # @cards_in_table = @game.cards
    # @actions = @game.cards.map(&:action)
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
    @game.actions = I18n.t('game.default_fields.actions').join("\n")
    authorize @game
  end

  # GET /games/1/edit
  def edit
    authorize @game
  end

  # POST /games or /games.json
  def create
    @game = Game.new(game_params)
    @game.user = current_user
    authorize @game

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
    authorize @game
    respond_to do |format|
      if @game.update(game_params)
        format.html { redirect_to game_url(@game), notice: t(".success") }
        format.json { render :show, status: :ok, location: @game }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @game.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /games/1 or /games/1.json
  def destroy
    authorize @game
    @game.destroy

    respond_to do |format|
      format.html { redirect_to games_url, notice: t(".success") }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.includes(cards: [:player, :target]).find(params[:id])
      @actions = @game.get_actions_list
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:name, :actions, :started_at)
    end

    def own_game
      if @game.user_id != current_user&.id
        flash.alert = "Vous n'avez pas accès a ce jeu!"
        redirect_back(fallback_location: root_path)
      end
    end
end
