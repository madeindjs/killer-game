class CardsMailer < ApplicationMailer

  # Subject can be set in your I18n file at config/locales/en.yml
  # with the following lookup:
  #
  #   en.cards_mailer.start.subject
  #
  def start card
    @card = card
    @game = card.game
    mail to: card.player.email, subject: "Ta mission pour la Killer Party \"#{@game.name}\""
  end
end
