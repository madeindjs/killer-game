module CardsHelper
  def card_qr_code card
    url = game_card_url(game_id: card.game_id, id: card.token)
    RQRCode::QRCode.new(url).as_svg({viewbox: true}).html_safe
  end
end
