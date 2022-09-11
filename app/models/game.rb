class Game < ApplicationRecord
  has_many :cards, dependent: :destroy
  has_many :players, dependent: :destroy
  belongs_to :user

  # after_save :recreate_cards

  before_save :send_start_mails, if: :started_at_changed?

  validates :actions, presence: true

  before_validation(on: :create) do
    self.token = SecureRandom.uuid
  end

  # TODO: use scope
  def alive_players
    Card.includes(:target).where(done_at: nil).map(&:target)
  end

  # TODO: use scope
  def dead_players
    Card.includes(:target).where.not(done_at: nil).map(&:target)
  end

  def get_actions_list
    actions.split("\n")
  end

  def cards_done
    cards.filter(&:done_at)
  end

  def started?
    !started_at.nil?
  end

  def is_alive? player
    !cards_done.any? {|card| card.target === player}
  end

  def recreate_cards
    Rails.logger.debug "Recreate cards for game #{id}"

    cards.destroy_all

    # players_list = players
    actions_list = get_actions_list().shuffle

    players.each.with_index do |target, index|
      player = players[index - 1]

      action_index = index % (actions_list.length)
      action = actions_list[action_index]

      cards.create! player: player, action: action, target: target
    end
  end

  def get_dashboard
    res = {}

    current_player = nil

    Card.includes(:player).where(game_id: id).each do |card|
      res[card.player] ||= []

      if card.done?
        current_player = card.player if current_player.nil?
        res[current_player] ||= []

        res[current_player] << card
      else
        current_player = nil
      end
    end

    return res
  end

  def send_start_mails
    return unless started?

    cards.each do |card|
      CardsMailer.start(card).deliver_later
    end
  end

end
