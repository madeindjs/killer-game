require "test_helper"

class GameTest < ActiveSupport::TestCase
  test "should be valid" do
    game = Game.new name: 'test', actions: 'test', user: users(:one)
    game.validate!
    assert game.valid?
  end

  test "should get dashboard" do
    game = Game.create!(
      name: "With",
      actions: 'test',
      user: users(:one),
      started_at: Time.now,
    )

    game.players = [
      Player.new(user: users(:one), game: game, name: '1', position: 1),
      Player.new(user: users(:two), game: game, name: '2', position: 2),
      Player.new(user: users(:three), game: game, name: '3', position: 3),
    ]

    game.save

    assert_equal 3, game.cards.size


    dashboard1 = game.get_dashboard2

    assert_equal dashboard1[0][:current], game.cards[0]
    assert_equal dashboard1[0][:cards], []
    assert_equal dashboard1[0][:player], game.players[0]
    assert_nil dashboard1[0][:rank]

    assert_equal dashboard1[1][:current], game.cards[1]
    assert_equal dashboard1[1][:cards], []
    assert_equal dashboard1[1][:player], game.players[1]
    assert_nil dashboard1[1][:rank]

    assert_equal dashboard1[2][:current], game.cards[2]
    assert_equal dashboard1[2][:cards], []
    assert_equal dashboard1[2][:player], game.players[2]
    assert_nil dashboard1[2][:rank]

    game.cards[1].set_done!

    dashboard2 = game.get_dashboard2

    assert_nil dashboard2[2]

    assert_equal dashboard2[0][:current], game.cards[0]
    assert_equal dashboard2[0][:cards], []
    assert_equal dashboard2[0][:player], game.players[0]
    assert_equal dashboard2[0][:rank], 2

    assert_equal dashboard2[1][:current], game.cards[2]
    assert_equal dashboard2[1][:cards], [game.cards[1]]
    assert_equal dashboard2[1][:player], game.players[1]
    assert_equal dashboard2[1][:rank], 1

    game.cards[2].set_done!

    dashboard3 = game.get_dashboard2

    # assert_nil dashboard3[1]

    assert_nil dashboard3[0][:current]
    assert_equal dashboard3[0][:cards], [game.cards[1], game.cards[2]]
    assert_equal dashboard3[0][:player], game.players[1]
  end

end
