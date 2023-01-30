class Api::V1::GamesController < Api::ApiController
  def index
    return head :unauthorized unless current_user

    render json: Game.where(user_id: current_user&.id)
  end
end
