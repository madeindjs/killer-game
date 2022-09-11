# Preview all emails at http://localhost:3000/rails/mailers/users_mailer
class UsersMailerPreview < ActionMailer::Preview
  def invitation
    UsersMailer.invitation User.first, Game.first
  end
end
