require "test_helper"

class PlayerTest < ActiveSupport::TestCase
  test "should generate a secret" do
    player = Player.create! game: games(:one), name: 'test'
    assert_not_nil player.secret
  end

  test "should generate order" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    assert_equal Player.create!(game: game, name: 'test1').position, 1
    assert_equal Player.create!(game: game, name: 'test2').position, 2
    assert_equal Player.create!(game: game, name: 'test3').position, 3
  end

  test "should create cards when creating player" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)

    player1 = Player.create!(game: game, name: 'test1')
    assert_not_nil Card.find_by(game: game.id, player: player1)

    player2 = Player.create!(game: game, name: 'test2')
    assert_not_nil Card.find_by(game: game.id, player: player2)

    player3 = Player.create!(game: game, name: 'test3')
    assert_not_nil Card.find_by(game: game.id, player: player3)

    cards = game.cards.order(:position)

    assert_equal cards[0].player, player1
    assert_equal cards[0].target, player2

    assert_equal cards[1].player, player2
    assert_equal cards[1].target, player3

    assert_equal cards[2].player, player3
    assert_equal cards[2].target, player1
  end

  test "should create cards when destroy middle player" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    player1 = Player.create!(game: game, name: 'test1')
    player2 = Player.create!(game: game, name: 'test2')
    player3 = Player.create!(game: game, name: 'test3')

    player2.destroy
    assert_nil Card.find_by(game: game.id, player: player2)

    game.reload
    cards = game.cards.order(:position)

    assert_equal cards.size, 2

    assert_equal cards[0].player, player1
    assert_equal cards[0].target, player3

    assert_equal cards[1].player, player3
    assert_equal cards[1].target, player1
  end

  test "should create cards when destroy first player" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    player1 = Player.create!(game: game, name: 'test1')
    player2 = Player.create!(game: game, name: 'test2')
    player3 = Player.create!(game: game, name: 'test3')

    player1.destroy
    assert_nil Card.find_by(game: game.id, player: player1)

    game.reload
    cards = game.cards.order(:position)

    assert_equal cards.size, 2

    assert_equal cards[0].player, player2
    assert_equal cards[0].target, player3

    assert_equal cards[1].player, player3
    assert_equal cards[1].target, player2
  end

  test "should create cards when destroy last player" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    player1 = Player.create!(game: game, name: 'test1')
    player2 = Player.create!(game: game, name: 'test2')
    player3 = Player.create!(game: game, name: 'test3')

    player3.destroy
    assert_nil Card.find_by(game: game.id, player: player3)

    game.reload
    cards = game.cards.order(:position)

    assert_equal cards.size, 2

    assert_equal cards[0].player, player1
    assert_equal cards[0].target, player2

    assert_equal cards[1].player, player2
    assert_equal cards[1].target, player1
  end

  test "should delete lonely player" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    player1 = Player.create!(game: game, name: 'test1')

    player1.destroy
    assert_nil Card.find_by(game: game.id, player: player1)
  end

  test "should update position lonely player" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    player1 = Player.create!(game: game, name: 'test1')
    player2 = Player.create!(game: game, name: 'test2')
    player3 = Player.create!(game: game, name: 'test3')

    assert_equal player1.position, 1
    assert_equal player2.position, 2
    assert_equal player3.position, 3

    player2.update position: 1

    [player1, player2, player3].map(&:reload)

    assert_equal player2.position, 1
    assert_equal player1.position, 2
    assert_equal player3.position, 3
  end


  # dead

  test "should be dead" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    player1 = Player.create!(game: game, name: 'test1')
    player2 = Player.create!(game: game, name: 'test2')
    player3 = Player.create!(game: game, name: 'test3')
    game.start!

    card = game.cards[0]

    assert_equal card, player1.current_card

    assert_not card.target.dead?

    card.set_done!

    card.target.reload

    assert card.target.dead?
  end


  # current_card

  test "should get current card" do
    game = Game.create! name: 'test', actions: "1", user: users(:one)
    player1 = Player.create!(game: game, name: 'test1')
    player2 = Player.create!(game: game, name: 'test2')
    player3 = Player.create!(game: game, name: 'test3')

    assert_equal game.cards[0], player1.current_card

    game.cards[0].set_done! player1

    assert_equal game.cards[0], player1.current_card
  end
end
