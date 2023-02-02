

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
