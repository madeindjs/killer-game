class Player < ApplicationRecord
  belongs_to :game
  belongs_to :user, optional: true
  has_many :cards, dependent: :destroy

  validates :name, presence: true

  after_save :recreate_cards

  before_destroy do |player|
    player.game.cards.destroy_all
  end

  after_destroy do |player|
    player.game.recreate_cards
  end

  def mission_card
    Card.find_by(game_id: game_id, player_id: id)
  end

  def victim_card
    Card.find_by(game_id: game_id, target_id: id)
  end

  def dead?
    victim_card&.done?
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
