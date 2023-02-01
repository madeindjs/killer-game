require "test_helper"

class Api::V1::GamesControllerTest < ActionDispatch::IntegrationTest

  setup do
    @game = games(:one)
    @token = "Bearer #{JsonWebToken.encode(user_id: @game.user.id)}"
    @token_other = "Bearer #{JsonWebToken.encode(user_id: users(:two).id)}"
  end

  # GET /games

  test "should GET /games" do
    get api_v1_games_url, headers: { Authorization: @token }
    assert_response :ok
  end

  test "should not GET /games without token" do
    get api_v1_games_url
    assert_response :forbidden
  end

  # POST /games

  test "should POST /games" do
    assert_difference("Game.count", 1) do
      post api_v1_games_url, params: {game: {name: @game.name, actions: @game.actions}}, headers: { Authorization: @token }
    end
    assert_response :ok
  end

  test "should not POST /games without token" do
    assert_difference("Game.count", 0) do
      post api_v1_games_url, params: {game: {name: @game.name, actions: @game.actions}}
    end
    assert_response :forbidden
  end

  # GET /games/:id

  test "should not GET /games/:id without token" do
    get api_v1_game_url(id: @game.id)
    assert_response :forbidden
  end

  test "should not GET /games/:id if not owner" do
    get api_v1_game_url(id: @game.id), headers: { Authorization: @token_other }
    assert_response :forbidden
  end

  test "should GET /games/:id" do
    get api_v1_game_url(id: @game.id), headers: { Authorization: @token }
    assert_response :ok
  end

  # PATCH /games/:id

  test "should not PATCH /games/:id without token" do
    patch api_v1_game_url(id: @game.id), params: {game: {name: 'test'}}
    assert_response :forbidden
  end

  test "should not PATCH /games/:id if not owner" do
    patch api_v1_game_url(id: @game.id), params: {game: {name: 'test'}}, headers: { Authorization: @token_other }
    assert_response :forbidden
  end

  test "should PATCH /games/:id" do
    patch api_v1_game_url(id: @game.id), params: {game: {name: 'test'}}, headers: { Authorization: @token }
    assert_response :ok
  end

  # DELETE /games/:id

  test "should not DELETE /games/:id without token" do
    delete api_v1_game_url(id: @game.id)
    assert_response :forbidden
  end

  test "should not DELETE /games/:id if not owner" do
    delete api_v1_game_url(id: @game.id), headers: { Authorization: @token_other }
    assert_response :forbidden
  end

  test "should DELETE /games/:id" do
    assert_difference("Game.count", -1) do
      delete api_v1_game_url(id: @game.id), headers: { Authorization: @token }
    end
    assert_response 204
  end
end
