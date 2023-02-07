require "test_helper"

class PlayerTest < ActiveSupport::TestCase
  test "should generate a secret" do
    player = Player.create! game: games(:one), name: 'test'
    assert_not_nil player.secret
  end
end
