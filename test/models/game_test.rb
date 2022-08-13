require "test_helper"

class GameTest < ActiveSupport::TestCase
  test "should be valid" do
    game = Game.new name: 'test', players: ['alex', 'bob'].join(','), actions: 'test', user: users(:one)
    game.validate!
    assert game.valid?
  end

  test "should not be valid because of same player" do
    game = Game.new name: 'test', players: ['alex', 'bob', 'alex'].join(','), actions: 'test', user: users(:one)
    game.validate!
    # assert_not game.valid?
    assert_not_nil game.errors[:players]
  end
end
