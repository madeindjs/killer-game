module CardsHelper
  def qr_code url
    RQRCode::QRCode.new(url).as_svg({viewbox: true}).html_safe
  end


  def weel_done_giffer_id
    gifer_ids = %w[4MR8 VzWJ ICI 1PHC 5SM 5W 1w0 1x7 Bjq Pim Fgu aMw 365 wuK 1O1k JbPh H8EN K1mm 8H0Y MHGH fy22 VoKr 3YMK 5Uw 1UFi gVP vOS 2lYS vUc]
    gifer_ids.sample
  end


  def get_podium cards
    cards.sort_by(&:id).reduce(''){|acc, v| acc += v.done? ? '.' : ' ' }.split(' ').map(&:size).sort().reverse.slice(0, 3)
  end
end
