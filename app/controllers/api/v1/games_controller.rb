class Api::V1::GamesController < Api::ApiController
  before_action :set_game, only: %i[ show edit update destroy ]

  def index
    authorize Game
    render json: Game.where(user_id: current_user&.id)
  end

  def show
    authorize @game
    render json: @game
  end

  def create
    @game = Game.new(game_params)
    @game.user = current_user
    authorize @game


    if @game.save
      render json: @game
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  def update
    authorize @game
    if @game.update(game_params)
      render json: @game
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
