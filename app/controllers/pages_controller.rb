class PagesController < ApplicationController
  # before_action :set_games_saw
  # before_action :set_cards_saw

  def home
  end

  def help
  end

  def actions
    @actions = t('game.default_fields.actions').sort

    if params[:tag]
      @title = t('.title_for', tag: params[:tag])

      case params[:tag]
      when "wedding"
        @actions = @actions.reject{|a| a.start_with?('🍺', '🥃', '💒')}
      when "workshop"
        @actions = @actions.reject{|a| a.start_with?('🍺', '🥃', '💒', '📱')}
      when "kids"
        @actions = @actions.reject{|a| a.start_with?('🍺', '🥃', '📱', '🎥', '🤳', '💒', '🇬🇧', '🇮🇹')}
      end
    else
      @title = t('.title')

    end


  end

  def api_doc
    render layout: 'swagger'
  end
end
