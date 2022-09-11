# Preview all emails at http://localhost:3000/rails/mailers/cards_mailer
class CardsMailerPreview < ActionMailer::Preview

  # Preview this email at http://localhost:3000/rails/mailers/cards_mailer/start
  def start
    CardsMailer.start Card.first
  end

end
