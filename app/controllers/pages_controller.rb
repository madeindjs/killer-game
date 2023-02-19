class PagesController < ApplicationController
  # before_action :set_games_saw
  # before_action :set_cards_saw

  def home
  end

  def help
  end

  def actions
    @actions = t('game.default_fields.actions').sort

    case params[:tag]
    when "workshop"
      @actions = @actions.reject{|a| a.start_with?('🍺', '🥃')}
    when "kids"
      @actions = @actions.reject{|a| a.start_with?('🍺', '🥃', '📱', '🎥', '🤳')}
    end
  end

  def api_doc
    render layout: 'swagger'
  end
end
