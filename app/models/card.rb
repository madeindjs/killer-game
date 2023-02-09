class CardValidator < ActiveModel::Validator
  def validate(record)
    if !record.game.started? and !record.done_at.nil?
      record.errors.add :done_at, "game_not_started"
    end
  end
end

class Card < ApplicationRecord
  belongs_to :game
  belongs_to :player
  belongs_to :target, class_name: "Player"

  validates :player, presence: true
  validates :action, presence: true
  validates :target, presence: true
  validates_with CardValidator, fields: [:done_at], on: :update

  before_validation(on: :create) do
    self.token = SecureRandom.uuid
    self.position = (Card.where(game_id: game_id).maximum(:position) || 0) + 1
  end

  def target_name
    target.split(',')[0]
  end

  def target_description
    target.split(',').slice(1).join(',')
  end

  def done?
    !done_at.nil?
  end

  def set_done!
    update(done_at: Time.now)
  end

  def next_card
    # TODO: remove
    card = Card.where('position > ? AND game_id = ?', position, game_id).first

    return card if card

    Card.where(game_id: game_id).order(:position).first
  end
end
