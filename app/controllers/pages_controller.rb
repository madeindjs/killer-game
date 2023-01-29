class PagesController < ApplicationController
  before_action :set_games_saw
  before_action :set_cards_saw

  def home
    build_example
  end

  def help
  end
end
