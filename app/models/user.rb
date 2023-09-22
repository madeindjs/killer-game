class User < ApplicationRecord
  has_many :games, dependent: :destroy
  has_many :players

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable


  after_create do |user|
    return if Rails.env.testing?

    msg = "New signup from #{user.email}"

    Ntfy.new('the-killer-online').send(msg) if Rails.env.production?
    Ntfy.new('the-killer-online_dev').send(msg) if Rails.env.development?
  end

  def self.find_by_email_or_create email
    user = User.find_for_authentication(email: email)

    if user.nil?
      raw, hashed = Devise.token_generator.generate(User, :reset_password_token)
      @token = raw

      user = User.create!(
        email: email,
        password: raw,
        reset_password_token: hashed,
        reset_password_sent_at: Time.now.utc,
      )
    end

    user
  end
end
