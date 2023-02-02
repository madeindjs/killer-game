require "test_helper"

class Api::V1::PlayersControllerTest < ActionDispatch::IntegrationTest

  setup do
    @game = games(:one)
    @player = @game.players.first
    @token = "Bearer #{JsonWebToken.encode(user_id: @game.user.id)}"
    @token_other = "Bearer #{JsonWebToken.encode(user_id: users(:two).id)}"
  end

  # GET /games/:game_id/players

  test "should GET /games/:game_id/players" do
    get api_v1_game_players_url(game_id: @game.id), headers: { Authorization: @token }
    assert_response :ok
  end

  test "should not GET /games/:game_id/players without token" do
    get api_v1_game_players_url(game_id: @game.id)
    assert_response :forbidden
  end

  # POST /games/:game_id/players

  test "should POST /games/:game_id/players" do
    assert_difference("Player.count", 1) do
      post api_v1_game_players_url(game_id: @game.id),
        params: { player: {name: @player.name, description: @player.description, email: @player.email}},
        headers: { Authorization: @token }
    end
    assert_response :ok
  end

  test "should not POST /games/:game_id/players if not owner" do
    assert_difference("Player.count", 0) do
      post api_v1_game_players_url(game_id: @game.id),
        params: { player: {name: @player.name, description: @player.description, email: @player.email}},
        headers: { Authorization: @token_other }
    end
    assert_response :forbidden
  end

  test "should not POST /games/:game_id/players without token" do
    assert_difference("Player.count", 0) do
      post api_v1_game_players_url(game_id: @game.id),
        params: { player: {name: @player.name, description: @player.description, email: @player.email}}
    end
    assert_response :forbidden
  end

  # GET /games/:game_id/players/:id

  test "should not GET /games/:game_id/players/:id without token" do
    get api_v1_game_player_url(game_id: @game.id, id: @player.id)
    assert_response :forbidden
  end

  test "should not GET /games/:game_id/players/:id if not owner" do
    get api_v1_game_player_url(game_id: @game.id, id: @player.id), headers: { Authorization: @token_other }
    assert_response :forbidden
  end

  test "should GET /games/:game_id/players/:id" do
    get api_v1_game_player_url(game_id: @game.id, id: @player.id), headers: { Authorization: @token }
    assert_response :ok
  end

  # PATCH /games/:game_id/players/:id

  test "should not PATCH /games/:game_id/players/:id without token" do
    patch api_v1_game_player_url(game_id: @game.id, id: @player.id),
      params: { player: {name: @player.name, description: @player.description, email: @player.email}}
    assert_response :forbidden
  end

  test "should not PATCH /games/:game_id/players/:id if not owner" do
    patch api_v1_game_player_url(game_id: @game.id, id: @player.id),
      params: { player: {name: @player.name, description: @player.description, email: @player.email}},
      headers: { Authorization: @token_other }

    assert_response :forbidden
  end

  test "should PATCH /games/:game_id/players/:id" do
    patch api_v1_game_player_url(game_id: @game.id, id: @player.id),
      params: { player: {name: @player.name, description: @player.description, email: @player.email}},
      headers: { Authorization: @token }

    assert_response :ok
  end

  # DELETE /games/:game_id/players/:id

  test "should not DELETE /games/:game_id/players/:id without token" do
    delete api_v1_game_player_url(game_id: @game.id, id: @player.id)
    assert_response :forbidden
  end

  test "should not DELETE /games/:game_id/players/:id if not owner" do
    delete api_v1_game_player_url(game_id: @game.id, id: @player.id), headers: { Authorization: @token_other }
    assert_response :forbidden
  end

  test "should DELETE /games/:game_id/players/:id" do
    assert_difference("Player.count", -1) do
      delete api_v1_game_player_url(game_id: @game.id, id: @player.id), headers: { Authorization: @token }
    end
    assert_response 204
  end
end
