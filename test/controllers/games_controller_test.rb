require "test_helper"

class GamesControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @game = games(:one)
  end

  test "should not get index cauz not signed" do
    get games_url
    assert_response :redirect
  end

  test "should get index" do
    sign_in users(:one)
    get games_url
    assert_response :success
  end

  test "should not get new cauz not signed" do
    get new_game_url
    assert_response :redirect
  end

  test "should get new" do
    sign_in users(:one)
    get new_game_url
    assert_response :success
  end

  test "should not create game cauz not signed" do
    assert_no_difference("Game.count") do
      post games_url, params: { game: { actions: @game.actions, name: @game.name, players: @game.players } }
    end

    # assert_redirected_to sign_in_url
  end

  test "should create game" do
    sign_in users(:one)
    assert_difference("Game.count") do
      post games_url, params: { game: { actions: @game.actions, name: @game.name, players: @game.players } }
    end

    assert_redirected_to game_url(Game.last)
  end

  test "should not show game cauz not signed" do
    get game_url(@game)
    assert_response :redirect
  end

  test "should show game cauz not owner" do
    sign_in users(:two)
    get game_url(@game)
    assert_response :redirect
  end

  test "should show game" do
    sign_in users(:one)
    get game_url(@game)
    assert_response :success
  end

  test "should not get edit cauz not signed" do
    get edit_game_url(@game)
    assert_response :redirect
  end

  test "should not get edit cauz not owner" do
    sign_in users(:two)
    get edit_game_url(@game)
    assert_response :redirect
  end

  test "should get edit" do
    sign_in users(:one)
    get edit_game_url(@game)
    assert_response :success
  end

  test "should not update game cauz not loged" do
    patch game_url(@game), params: { game: { actions: @game.actions, name: @game.name, players: @game.players } }
    assert_response :redirect
  end

  test "should not update game cauz not owner" do
    sign_in users(:two)
    patch game_url(@game), params: { game: { actions: @game.actions, name: @game.name, players: @game.players } }
    assert_response :redirect
  end

  test "should update game" do
    sign_in users(:one)
    patch game_url(@game), params: { game: { actions: @game.actions, name: @game.name, players: @game.players } }
    assert_redirected_to game_url(@game)
  end

  test "should not destroy game cauz not logged" do
    assert_no_difference("Game.count", -1) do
      delete game_url(@game)
    end

    assert_response :redirect
  end

  test "should not destroy game cauz not owner" do
    sign_in users(:two)
    assert_no_difference("Game.count", -1) do
      delete game_url(@game)
    end

    assert_response :redirect
  end

  test "should destroy game" do
    sign_in users(:one)
    assert_difference("Game.count", -1) do
      delete game_url(@game)
    end

    assert_redirected_to games_url
  end
end
