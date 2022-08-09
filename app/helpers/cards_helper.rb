module CardsHelper
  def qr_code url
    RQRCode::QRCode.new(url).as_svg({viewbox: true}).html_safe
  end
end
