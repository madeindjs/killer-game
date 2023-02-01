class Api::V1::CardsController < Api::ApiController
  before_action :set_game
  before_action :set_card, only: %i[ show update destroy ]

  def index
    authorize Card.new game: @game

    render json: @game.cards
  end

  def show
    authorize @card
    render json: @card
  end

  # def create
  #   @card = @game.cards.new(card_param)
  #   authorize @card


  #   if @game.save
  #     render json: @game
  #   else
  #     render json: @game.errors, status: :unprocessable_entity
  #   end
  # end

  def update
    authorize @card
    if @card.update(card_param)
      render json: @card
    else
      render json: @card.errors, status: :unprocessable_entity
    end
  end

  # DELETE /games/1 or /games/1.json
  # def destroy
  #   authorize @card
  #   @card.destroy
  #   head :no_content
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_game
      @game = Game.find(params[:game_id])
    end

    def set_card
      @card = @game.cards.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def card_param
      params.require(:card).permit(:action)
    end
end
