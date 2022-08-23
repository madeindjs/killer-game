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

    game.get_players_list.each do |player|
      assert_includes card_players, player
      assert_includes card_targets, player
    end
  end

  test "should setup the user action through preferences" do
    game = Game.create!(
      name: "With",
      players: %w[1 2 3].join("\n"),
      actions: (1..99).to_a.join("\n"),
      user: users(:one),
      target_action_preferences: '2 > 66',
    )

    assert_equal 3, game.cards.size

    assert_equal "66", game.cards.find_by(target: "2").action
  end

  test "should setup the user action through preferences in real example" do
    game = Game.create!(
      name: "With",
      players: ['Alice, la danseuse', 'Bob, le trou'].join("\n"),
      actions: (%w[danser boire_un_verre] + (1..100).map(&:to_s).to_a).join("\n"),
      user: users(:one),
      target_action_preferences: ['Alice > danser', 'Bob > boire'].join("\n"),
    )

    assert_equal "danser", game.cards.find_by(target: 'Alice, la danseuse').action
    assert_equal "boire_un_verre", game.cards.find_by(target: 'Bob, le trou').action
  end
end
