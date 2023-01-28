require "test_helper"

class CardTest < ActiveSupport::TestCase
  test "should recreate cards" do
    game = Game.create!(
      name: "With",
      actions: 'test',
      user: users(:one)
    )

    game.players = [
      Player.new(user: users(:one), game: game, name: '1'),
      Player.new(user: users(:two), game: game, name: '2'),
      Player.new(user: users(:three), game: game, name: '3'),
    ]

    game.recreate_cards

    card1 = game.cards[0]
    card2 = game.cards[1]
    card3 = game.cards[2]

    assert_equal card1.next_card, card2
    assert_equal card2.next_card, card3
    assert_equal card3.next_card, card1

    # card_players = game.cards.map{|card| card.player.user.email}
    # card_targets = game.cards.map{|card| card.target.user.email}

    # game.players.each do |player|
    #   assert_includes card_players, player.email
    #   assert_includes card_targets, player.email
    # end
  end
end
