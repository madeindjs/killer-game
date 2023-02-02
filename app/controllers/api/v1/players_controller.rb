class Api::V1::PlayersController < Api::ApiController
  before_action :set_game
  before_action :set_player, only: %i[ show update destroy ]

  def index
    authorize Player.new game: @game
    render json: PlayerSerializer.new(@game.players).serializable_hash
  end

  def show
    authorize @player
    render json: PlayerSerializer.new(@player).serializable_hash
  end

  def create
    @player = @game.players.new(player_param)
    authorize @player


    if @game.save
      render json: PlayerSerializer.new(@player).serializable_hash
    else
      render json: @game.errors, status: :unprocessable_entity
    end
  end

  def update
    authorize @player
    if @player.update(player_param)
      render json: PlayerSerializer.new(@player).serializable_hash
    else
      render json: @player.errors, status: :unprocessable_entity
    end
  end

  # DELETE /games/1 or /games/1.json
  def destroy
    authorize @player
    @player.destroy
    head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:game_id])
    end

    def set_player
      @player = @game.players.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def player_param
      params.require(:player).permit(:name, :description, :email)
    end
end
