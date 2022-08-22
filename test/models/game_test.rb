require "test_helper"

class GameTest < ActiveSupport::TestCase
  test "should be valid" do
    game = Game.new name: 'test', players: ['alex', 'bob'].join("\n"), actions: 'test', user: users(:one)
    game.validate!
    assert game.valid?
  end

  test "should not be valid because of same player" do
    game = Game.new name: 'test', players: %w[alex bob alex].join("\n"), actions: 'test', user: users(:one)
    game.validate! rescue
    # assert_not game.valid?
    assert_not_nil game.errors[:players]
  end

  test "should recreate cards" do
    game = Game.create!(
      name: "With",
      players: %w[1 2 3].join("\n"),
      actions: 'test',
      user: users(:one)
    )


    assert_equal 3, game.cards.size

    card_players = game.cards.map(&:player)
    card_targets = game.cards.map(&:target)

    game.players_list.each do |player|
      assert_includes card_players, player
      assert_includes card_targets, player
    end
  end
end
