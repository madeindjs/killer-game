class ApplicationController < ActionController::Base
  include Pundit::Authorization
  # before_action :set_games_saw
  # before_action :set_cards_saw
  around_action :switch_locale

  rescue_from Pundit::NotAuthorizedError do |_exception|
    flash.alert = "Vous n'avez pas accès a ce jeu!"
    redirect_back(fallback_location: root_path)
  end

  def default_url_options
    { locale: params[:locale] || I18n.default_locale }
  end

  protected

  def switch_locale(&action)
    @locale = params[:locale] || I18n.default_locale
    I18n.with_locale(@locale, &action)
  end

  # def set_games_saw
  #   @games_saw = Game.where token: (cookies[:games]&.split(',') || [])
  #   cookies[:games] = @games_saw.map(&:token).join(',')
  # end

  # def set_cards_saw
  #   @cards_saw = Card.where token: (cookies[:cards]&.split(',') || [])
  #   cookies[:cards] = @cards_saw.map(&:token).join(',')
  # end


  # def saw_card token
  #   cookies[:cards] ||= ""
  #   cookies[:cards] = cookies[:cards].split(',').push(token).uniq.join(',')
  # end

  # def saw_game token
  #   cookies[:games] ||= ""
  #   cookies[:games] = cookies[:games].split(',').push(token).uniq.join(',')
  # end
end
