module ApplicationHelper

  def switch_lang_link
    if @locale == 'en'
      link_to t('french_version'), root_path(locale: 'fr')
    else
      link_to t('english_version'), root_path(locale: 'en')
    end
  end


  def is_admin? game
    game.user_id === current_user&.id
  end

  def format_time date
    date.strftime("%H:%M")
  end
end
