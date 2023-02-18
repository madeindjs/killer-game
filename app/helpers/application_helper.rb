module ApplicationHelper
  def qr_code url
    RQRCode::QRCode.new(url).as_svg({viewbox: true}).html_safe
  end

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

  def tt key
    path = "#{controller_name}.#{action_name}"

    begin
      t "#{path}.#{key}", raise: true
    rescue I18n::MissingTranslationData
      t "default.#{key}"
    end
  end
end
