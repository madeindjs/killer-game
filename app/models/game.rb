class Game < ApplicationRecord
  has_many :cards
  after_save :recreate_cards

  def players_list
    players.split("\n")
  end

  def actions_list
    actions.split("\n")
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
end
