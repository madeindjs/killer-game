require "test_helper"

class PlayerTest < ActiveSupport::TestCase
  test "should generate a secret" do
    player = Player.create! game: games(:one), name: 'test'
    assert_not_nil player.secret
  end

  test "should generate order" do
    assert_equal Player.create!(game: games(:one), name: 'test1').order, 1
    assert_equal Player.create!(game: games(:one), name: 'test2').order, 2
    assert_equal Player.create!(game: games(:one), name: 'test3').order, 3
  end
end
