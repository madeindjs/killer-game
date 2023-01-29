class PagesController < ApplicationController
  before_action :set_games_saw
  before_action :set_cards_saw

  def home
  end

  def help
    players = [
      Player.new(name: "Bob"),
      Player.new(name: "Alice"),
      Player.new(name: "Luc"),
      Player.new(name: "Fred"),
    ]

    actions = I18n.t('game.default_fields.actions')

    cards = [
      Card.new(player: players[0], target: players[1], action: actions[0]),
      Card.new(player: players[1], target: players[2], action: actions[1]),
      Card.new(player: players[2], target: players[3], action: actions[2]),
      Card.new(player: players[3], target: players[0], action: actions[3]),
    ]
    cards.map{|card| card.done_at = Time.now}


    @exemple1 = [
      { player: players[0], cards: [], current: cards[0] },
      { player: players[1], cards: [], current: cards[1] },
      { player: players[2], cards: [], current: cards[2] },
      { player: players[3], cards: [], current: cards[3] },
    ]

    @exemple2 = [
      { player: players[0], cards: [], current: cards[0] },
      { player: players[1], cards: [cards[1]], current: cards[2], rank: 1 },
      { player: players[3], cards: [], current: cards[3] },
    ]

    @exemple3 = [
      { player: players[0], cards: [cards[0], cards[1]], current: cards[2], rank: 1 },
      { player: players[3], cards: [], current: cards[3] },
    ]

    @exemple4 = [
      { player: players[3], cards: [cards[0], cards[1], cards[2]], current: nil },
    ]
  end
end
