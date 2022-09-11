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

    # target_action_preferences_items = get_target_action_preferences_items

    # players_list = players
    actions_list = get_actions_list().shuffle

    players.each.with_index do |target, index|
      player = players[index - 1]

      puts "\tplayer #{player.email}"

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
    puts '*' * 80
    return unless started?
    puts 'send_start_mails'

    cards.each do |card|
      CardsMailer.start(card).deliver_later
    end
  end

  private

    def get_target_action_preferences_items
      return [] if target_action_preferences.nil?

      target_action_preferences.split("\n").map do |row|
        split = row.split('>').map(&:strip)

        {target: split[0], action: split[1]}
      end.reject {|item| item[:target].nil? || item[:action].nil?}
    end

end
