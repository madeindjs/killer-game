class Game < ApplicationRecord
  has_many :cards, dependent: :destroy
  belongs_to :user
  after_save :recreate_cards

  validate :validate_uniq_players

  before_validation(on: :create) do
    self.token = SecureRandom.uuid
  end

  def players_list
    players.split("\n")
  end

  def alive_players_list
    players_list.filter { |player| is_alive? player }
  end

  def dead_players_list
    players_list.filter { |player| !is_alive? player }
  end

  def actions_list
    actions.split("\n")
  end

  def cards_done
    cards.filter(&:done_at)
  end


  def started?
    cards_done.size > 0
  end

  def is_alive? player
    !cards_done.any? {|card| card.target === player}
  end


  def recreate_cards
    cards.each(&:delete)

    players_random = players_list.shuffle
    actions_shuffle = actions_list.shuffle

    players_random.each.with_index do |player, index|
      action_index = index % (actions_shuffle.length)
      action = actions_shuffle[action_index]

      Card.create! game_id: id, player: player, action: action, target: players_random[index - 1]
    end
  end

  private

    def validate_uniq_players
      players_array = players_list
      duplicate_player = players_array.detect {|e| players_array.rindex(e) != players_array.index(e) }

      if duplicate_player
        errors.add(:players, "#{duplicate_player} est en double dans la liste")
      end
    end
end
