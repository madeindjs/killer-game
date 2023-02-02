

class Api::V1::GamesController < Api::ApiController
  before_action :set_game, only: %i[ show edit update destroy ]

  def index
    authorize Game
    render json: GameSerializer.new(Game.where(user_id: current_user&.id)).serializable_hash
  end

  def show
    authorize @game
    render json: GameSerializer.new(@game).serializable_hash
  end

  def dashboard
    @game = Game.includes(:players, cards: [:player, :target]).find(params[:game_id])

    dashboard = @game.get_dashboard2.map do |row|
      {
        player: PlayerSerializer.new(row[:player]).serializable_hash[:data],
        current: row[:current] ? CardSerializer.new(row[:current]).serializable_hash[:data] : nil,
        cards: row[:cards].map { |card| CardSerializer.new(card).serializable_hash[:data] },
        rank: row[:rank],
      }
    end

    render json: {data: dashboard}
  end

  def create
    @game = Game.new(game_params)
    @game.user = current_user

    if @game.save
      render json: GameSerializer.new(@game).serializable_hash
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  def update
    authorize @game
    if @game.update(game_params)
      render json: GameSerializer.new(@game).serializable_hash
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  # DELETE /games/1 or /games/1.json
  def destroy
    authorize @game
    @game.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def game_params
      params.require(:game).permit(:name, :actions, :started_at)
    end
end
