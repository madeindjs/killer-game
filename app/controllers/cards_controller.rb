class CardsController < ApplicationController
  before_action :set_card, only: %i[ show edit update destroy kill ]
  before_action :set_game
  before_action :own_game, only: %i[ edit ]

  # GET /cards or /cards.json
  def index
    @is_search_active = params[:player] || params[:card_action]

    @cards = Card.where game_id: params[:game_id]

    if (!params[:player].nil? && !params[:player].empty?)
      @cards = @cards.where('player_id = ? OR target_id = ?', params[:player], params[:player])
    end

    if (!params[:card_action].nil? && !params[:card_action].empty?)
      @cards = @cards.where(action: params[:card_action])
    end

    # TODO: sort
    @players_options = @game.players.map{|p| [p.pretty, p.id]}
    @actions_options = @game.cards.map(&:action).sort
  end

  def print
    @cards = Card.where game_id: params[:game_id]
    render layout: 'print'
  end

  # GET /cards/1 or /cards/1.json
  def show
    saw_game @card.game.token
    saw_card @card.token

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

  # PATCH/PUT /cards/1 or /cards/1.json
  def update
    # if card_params[:done_at] == "1"

    #   if card_params[:secret] == @card.target.secret.to_s
    #     @card.done_at = Time.now
    #   else
    #     flash[:alert] = t '.wrong_secret'
    #   end
    # elsif card_params[:done_at] == "0"
    #   @card.done_at = nil
    # end

    @card.action = card_params[:action] if card_params[:action]

    respond_to do |format|
      if @card.save
        format.html {
          redirect_back(
            fallback_location: game_url(@card.game),
            notice: t(".success")
          )
        }
        format.json { render :show, status: :ok, location: @card }
        format.js {  }
      else
        format.html {
          redirect_back(
            fallback_location: game_url(@card.game_id),
            alert: t(".error"),
            status: :unprocessable_entity
          )
        }
        format.json { render json: @card.errors, status: :unprocessable_entity }
        format.js {  }
      end
    end
  end

  def kill
    player = Player.find_by(token: params[:token])

    fallback_location = player_dashboard_url(token: player.token)

    return redirect_back(
      fallback_location: fallback_location,
      alert: t(".wrong_secret"),
      status: :unprocessable_entity
    ) if params[:secret] != @card.target.secret.to_s

    @card.killed_by = player
    @card.done_at = Time.now

    if @card.save
      redirect_back(fallback_location: fallback_location, notice: t(".success"))
    else
      redirect_back(fallback_location: fallback_location, alert: t(".error"), status: :unprocessable_entity)
    end
  end

  # DELETE /cards/1 or /cards/1.json
  # def destroy
  #   @card.destroy

  #   respond_to do |format|
  #     format.html { redirect_to cards_url, notice: "Card was successfully destroyed." }
  #     format.json { head :no_content }
  #   end
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_card
      @card = Card.includes(:game).find_by(id: params[:id])
      @game = @card.game
    end

    # Only allow a list of trusted parameters through.
    def card_params
      if current_user
        params.require(:card).permit(:done_at, :action, :secret)
      else
        params.require(:card).permit(:done_at, :secret)
      end
    end

    def own_game
      if @card.game.user_id != current_user&.id
        flash.alert = "Vous n'avez pas accès a ce jeu!"
        redirect_back(fallback_location: root_path)
      end
    end

    def set_game
      @game = Game.find params[:game_id] unless @game

      # if @game.user_id != current_user&.id
      #   flash.alert = "Vous n'avez pas accès a ce jeu!"
      #   redirect_back(fallback_location: root_path)
      # end
    end
end
