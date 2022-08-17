class ApplicationController < ActionController::Base
  # before_action :set_games_saw
  # before_action :set_cards_saw
  before_action :set_title

  protected


  def set_title
    @title = t '.title'
  end

  def set_games_saw
    @games_saw = Game.where token: (cookies[:games]&.split(',') || [])
    cookies[:games] = @games_saw.map(&:token).join(',')
  end

  def set_cards_saw
    @cards_saw = Card.where token: (cookies[:cards]&.split(',') || [])
    cookies[:cards] = @cards_saw.map(&:token).join(',')
  end


  def saw_card token
    cookies[:cards] ||= ""
    cookies[:cards] = cookies[:cards].split(',').push(token).uniq.join(',')
  end

  def saw_game token
    cookies[:games] ||= ""
    cookies[:games] = cookies[:games].split(',').push(token).uniq.join(',')
  end
end
