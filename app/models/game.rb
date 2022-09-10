class Game < ApplicationRecord
  has_many :cards, dependent: :destroy
  belongs_to :user
  has_many :players

  after_save :recreate_cards

  # validate :validate_uniq_players
  # validates :players, presence: true
  validates :actions, presence: true

  before_validation(on: :create) do
    self.token = SecureRandom.uuid
  end

  def get_players_list
    players.split("\n")
  end

  def alive_players_list
    get_players_list.filter { |player| is_alive? player }
  end

  def dead_players_list
    get_players_list.filter { |player| !is_alive? player }
  end

  def get_actions_list
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
    cards.destroy_all

    target_action_preferences_items = get_target_action_preferences_items

    players_list = players
    actions_list = get_actions_list().shuffle

    players_list.each.with_index do |target, index|
      player = players_list[index - 1]

      # check if target have pref
      # actions_preferences = target_action_preferences_items.filter{ |item| target.include?(item[:target]) }

      action = nil

      # if actions_preferences
      #   actions = actions_preferences.map{|i| i[:action]}
      #   action_found = actions_list.find{|a_list| actions.any?{|a| a_list.include?(a) }}
      #   action = action_found unless action_found.nil?
      # end

      if action.nil?
        action_index = index % (actions_list.length)
        action = actions_list[action_index]
      end


      cards.create! player: player, action: action, target: target
    end
  end

  def get_dashboard
    res = {}

    current_player = nil

    Card.where(game_id: id).each do |card|
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

  private

    def get_target_action_preferences_items
      return [] if target_action_preferences.nil?

      target_action_preferences.split("\n").map do |row|
        split = row.split('>').map(&:strip)

        {target: split[0], action: split[1]}
      end.reject {|item| item[:target].nil? || item[:action].nil?}
    end

    def validate_uniq_players
      players_array = get_players_list
      duplicate_player = players_array.detect {|e| players_array.rindex(e) != players_array.index(e) }

      if duplicate_player
        errors.add(:players, "#{duplicate_player} est en double dans la liste")
      end
    end
end
