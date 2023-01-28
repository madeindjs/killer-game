class Card < ApplicationRecord
  belongs_to :game
  belongs_to :player
  belongs_to :target, class_name: "Player"

  validates :player, presence: true
  validates :action, presence: true
  validates :target, presence: true

  before_validation(on: :create) do
    self.token = SecureRandom.uuid
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
    card = Card.where('position > ? AND game_id = ?', position, game_id).first

    return card if card

    Card.where(game_id: game_id).order(:position).first
  end
end
