class ApplicationController < ActionController::Base
  # before_action :set_games_saw
  # before_action :set_cards_saw
  before_action :set_title

  protected


  def set_title
    @title = t '.title'
  end

  def set_games_saw
    @games_saw = (cookies[:games]&.split(',') || []).map { |token| Game.find_by(token: token) }.reject(&:nil?)
    cookies[:games] = @games_saw.map(&:token).join(',')
  end

  def set_cards_saw
    @cards_saw = (cookies[:cards]&.split(',') || []).map { |token| Card.find_by(token: token) }.reject(&:nil?)
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
