class UsersMailer < ApplicationMailer
  def invitation user, game
    @user = user
    @game  = game
    mail(to: @user.email, subject: 'Welcome to My Awesome Site')
  end
end
