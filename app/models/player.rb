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

  has_many :kill_cards, foreign_key: :killed_by, class_name: :Card
  has_one :victim_card, foreign_key: :target_id, class_name: :Card

  # belongs_to :current_card, class_name: :Card, ->(player) { where("friend_a_id = ? OR friend_b_id = ?", user.id, user.id) }

  # TODO: forbid create/delete on game started

  validates :name, presence: true
  validates :token, presence: true

  before_validation(on: :create) do
    self.token = SecureRandom.uuid
  end

  before_create do
    self.secret = rand(1..99)
    self.position = (Player.where(game_id: game_id).maximum(:position) || 0) + 1
  end

  after_create :insert_card

  before_update :reset_players_position

  before_destroy :destroy_card, prepend: true


  def current_card
    return nil if dead?

    dashboard = game.get_dashboard2

    return dashboard.find {|row| row[:player].id === id}[:current]
  end

  def dead?
    # puts victim_card.inspect
    victim_card&.done?
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
