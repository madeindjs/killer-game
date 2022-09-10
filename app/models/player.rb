class Player < ApplicationRecord
  belongs_to :game

  validates :name, presence: true

  after_save :recreate_cards

  has_one :mission_card, ->(player) { where(game_id: player.game_id, player_id: player.id) }, class_name: 'Card'

  has_one :victim_card, ->(player) { where(game_id: player.game_id, target_id: player.id) }, class_name: 'Card'

  def pretty
    sentence = [name]
    sentence << "(#{description})" unless description.nil? || description == ""
    sentence.join(' ')
  end


  def recreate_cards
    game.recreate_cards
  end
end
