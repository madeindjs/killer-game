# class PlayerValidator < ActiveModel::Validator
#   def validate(record)
#     if !record.game.started?
#       record.errors.add :done_at, "game_not_started"
#     end
#   end
# end

class Player < ApplicationRecord
  belongs_to :game
  belongs_to :user, optional: true
  has_many :cards, dependent: :destroy

  # TODO: forbid create/delete on game started

  validates :name, presence: true

  before_create do
    self.secret = rand(1..99)
    self.position = (Player.where(game_id: game_id).maximum(:position) || 0) + 1
  end

  after_create :insert_card

  before_update :reset_players_position

  before_destroy :destroy_card, prepend: true

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

  private

  def insert_card
    cards = game.cards.order(:position)

    # create first card
    return game.cards.create!(target: self, player: self, action: game.random_action) if cards.size == 0

    # otherwhise, update last card
    cards.last.update target: self
    game.cards.create!(target: cards.first.player, player: self, action: game.random_action)
  end

  def destroy_card
    cards = game.cards.order(:position)

    index = cards.index { |card| card.player_id == id }

    return if index.nil?

    previous_card = cards[index - 1]
    current_card = cards[index]
    next_card = cards[(index % cards.size) + 1] || cards[0]

    previous_card.update! target: next_card.player
    current_card.destroy
  end

  def reset_players_position
    return unless position_changed?

    Player.find_by(game_id: game_id, position: position)&.update_column(:position, position_was)
  end
end
