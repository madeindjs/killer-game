class UsersMailer < ApplicationMailer
  helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  # default template_path: 'users/mailer' # to make sure that your mailer uses the devise views

  def invitation user, game
    create_reset_password_token(user)
    @user = user
    @game = game
    mail(to: @user.email, subject: "Tu as été invité a une partie de Killer!")
  end

  private

  def create_reset_password_token(user)
    raw, hashed = Devise.token_generator.generate(User, :reset_password_token)
    user.reset_password_token = hashed
    user.reset_password_sent_at = Time.now.utc
    @reset_password_token = raw
    user.save
 end
end
