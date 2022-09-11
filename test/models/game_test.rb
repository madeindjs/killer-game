require "test_helper"

class GameTest < ActiveSupport::TestCase
  test "should be valid" do
    game = Game.new name: 'test', actions: 'test', user: users(:one)
    game.validate!
    assert game.valid?
  end

  # test "should not be valid because of same player" do
  #   game = Game.new name: 'test', players: %w[alex bob alex].join("\n"), actions: 'test', user: users(:one)
  #   game.validate! rescue
  #   # assert_not game.valid?
  #   assert_not_nil game.errors[:players]
  # end

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

    assert_equal 3, game.cards.size

    card_players = game.cards.map{|card| card.player.user.email}
    card_targets = game.cards.map{|card| card.target.user.email}

    game.players.each do |player|
      assert_includes card_players, player.email
      assert_includes card_targets, player.email
    end
  end

  # test "should get dashboard" do
  #   game = Game.create!(
  #     # players: %w[0 1 2 3 4 5 6 7 8 9].join("\n"),
  #     actions: ['an action'].join("\n"),
  #     user: users(:one),
  #   )
  #   # game.players

  #   game.cards.where(target: %w[2 3 5 6 8]).each(&:set_done!)

  #   expected = {
  #     "0" => [],
  #     "1" => Card.where(target: %w[2 3], game_id: game.id).to_a,
  #     "2" => [],
  #     "3" => [],
  #     "4" => Card.where(target: %w[5 6], game_id: game.id).to_a,
  #     "5" => [],
  #     "6" => [],
  #     "7" => Card.where(target: %w[8], game_id: game.id).to_a,
  #     "8" => [],
  #     "9" => [],
  #   }

  #   dashboard = game.get_dashboard

  #   (0..9).each do |player|
  #     assert_equal expected[player.to_s], dashboard[player.to_s], player
  #   end
  # end
end
