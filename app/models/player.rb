class Player < ApplicationRecord
  belongs_to :game
  belongs_to :user
  has_many :cards, dependent: :destroy
  has_one :mission_card, ->(player) { where(game_id: player.game_id, player_id: player.id) }, class_name: 'Card'
  has_one :victim_card, ->(player) { where(game_id: player.game_id, target_id: player.id) }, class_name: 'Card'

  validates :name, presence: true

  after_save :recreate_cards


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
