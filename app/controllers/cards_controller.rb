class CardsController < ApplicationController
  before_action :set_card, only: %i[ show edit update destroy ]
  before_action :own_game, only: %i[ edit ]

  # GET /cards or /cards.json
  def index
    @cards = Card.where game_id: params[:game_id]
    render layout: 'print'
  end

  # GET /cards/1 or /cards/1.json
  def show
    saw_dashboard @card.game.token

    # TODO: copy/paste from game controller
    @cards_done = @card.game.cards_done.sort_by(&:done_at).reverse
  end

  # GET /cards/new
  def new
    @card = Card.new
  end

  # GET /cards/1/edit
  def edit
  end

  # POST /cards or /cards.json
  def create
    @card = Card.new(card_params)

    respond_to do |format|
      if @card.save
        format.html { redirect_to card_url(@card), notice: "Ta carte a été mise à jour" }
        format.json { render :show, status: :created, location: @card }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @card.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /cards/1 or /cards/1.json
  def update
    @card.done_at = card_params[:done_at] == "1" ? Time.now : nil

    respond_to do |format|
      if @card.save
        format.html { redirect_back fallback_location: game_url(@card.game), notice: "Card was successfully updated." }
        format.json { render :show, status: :ok, location: @card }
        format.js {  }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @card.errors, status: :unprocessable_entity }
        format.js {  }
      end
    end
  end

  # DELETE /cards/1 or /cards/1.json
  def destroy
    @card.destroy

    respond_to do |format|
      format.html { redirect_to cards_url, notice: "Card was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_card
      @card = Card.includes(:game).find_by(token: params[:id] || params[:token])
    end

    # Only allow a list of trusted parameters through.
    def card_params
      params.require(:card).permit(:done_at)
    end

    def own_game
      if @card.game.user_id != current_user.id
        flash.alert = "Vous n'avez pas accès a ce jeu!"
        redirect_back(fallback_location: root_path)
      end
    end
end
