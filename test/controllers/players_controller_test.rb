require "test_helper"

class PlayersControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @player = players(:one)
  end

  test "should create player with an existing user" do
    sign_in users(:one)
    assert_difference("Player.count") do
      post game_players_url(game_id: @player.game_id), params: { player: { description: @player.description, name: @player.name, email: (users(:two).email) } }
    end

    assert_redirected_to game_url(id: @player.game_id)
  end

  test "should create player with an unexisting user" do
    sign_in users(:one)
    assert_difference("Player.count") do
      assert_difference("User.count") do
        post game_players_url(game_id: @player.game_id), params: { player: { description: @player.description, name: @player.name, email: "unexisting@email.fr" } }
      end
    end

    assert_redirected_to game_url(id: @player.game_id)
  end

  test "should create player without emails" do
    sign_in users(:one)
    assert_difference("Player.count") do
      post game_players_url(game_id: @player.game_id), params: { player: { description: @player.description, name: @player.name } }
    end

    assert_redirected_to game_url(id: @player.game_id)
  end

  test "should get edit" do
    sign_in users(:one)
    get edit_game_player_url(game_id: @player.game_id, id: @player.id)
    assert_response :success
  end

  test "should update player" do
    sign_in users(:one)
    patch game_player_url(game_id: @player.game_id, id: @player.id), params: { player: { description: @player.description, name: @player.name } }
    assert_redirected_to game_url(id: @player.game_id)
  end

  test "should destroy player" do
    sign_in users(:one)
    assert_difference("Player.count", -1) do
      delete game_player_url(game_id: @player.game_id, id: @player.id)
    end

    assert_redirected_to game_url(id: @player.game_id)
  end
end
