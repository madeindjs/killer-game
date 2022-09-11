class Player < ApplicationRecord
  belongs_to :game
  belongs_to :user
  has_many :cards, dependent: :destroy

  validates :name, presence: true

  after_save :recreate_cards

  def mission_card
    Card.find_by(game_id: game_id, player_id: id)
  end

  def victim_card
    Card.find_by(game_id: game_id, target_id: id)
  end

  def dead?
    Card.find_by(game_id: game_id, target_id: id).done?
  end

  def done_cards
    cards = []

    current = mission_card

    while current&.done?
      cards.push current
      current = current.next_card
    end

    return cards
  end

  def email= email
    self.user = User.find_by(email: email)

    if self.user.nil?
      raw, hashed = Devise.token_generator.generate(User, :reset_password_token)
      @token = raw

      self.user = User.create!(
        email: email,
        password: raw,
        reset_password_token: hashed,
        reset_password_sent_at: Time.now.utc,
      )

      UsersMailer.invitation(self.user, game).deliver_later
    end
  end

  def email
    user&.email
  end

  def pretty
    sentence = [name]
    sentence << "(#{description})" unless description.nil? || description == ""
    sentence.join(' ')
  end


  def recreate_cards
    game.recreate_cards
  end
end
