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

  def email= email
    self.user = User.find_by(email: email)
    self.user = User.create!(email: email, password: 'TODO: generate') if self.user.nil?
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
