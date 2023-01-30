class Api::ApiController < ActionController::API
  # include Pundit::Authorization
  include Authenticable
  # include ActionController::Cookies # needed during API transition

  # rescue_from Pundit::NotAuthorizedError do |_exception|
  #   head :forbidden
  # end



  protected

  def render_alert
    head :forbidden
  end

  def check_login
    return render_alert unless current_user
  end
end