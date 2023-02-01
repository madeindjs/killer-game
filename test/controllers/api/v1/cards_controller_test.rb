require "test_helper"

class Api::V1::CardsControllerTest < ActionDispatch::IntegrationTest

  setup do
    @game = games(:one)
    @card = @game.cards.first
    @token = "Bearer #{JsonWebToken.encode(user_id: @game.user.id)}"
    @token_other = "Bearer #{JsonWebToken.encode(user_id: users(:two).id)}"
  end

  # GET /games/:game_id/cards

  test "should GET /games/:game_id/cards" do
    get api_v1_game_cards_url(game_id: @game.id), headers: { Authorization: @token }
    assert_response :ok
  end

  test "should not GET /games/:game_id/cards without token" do
    get api_v1_game_cards_url(game_id: @game.id)
    assert_response :forbidden
  end

  # POST /games/:game_id/cards

  # test "should POST /games/:game_id/cards" do
  #   assert_difference("Player.count", 1) do
  #     post api_v1_game_cards_url(game_id: @game.id),
  #       params: { player: {name: @card.name, description: @card.description, email: @card.email}},
  #       headers: { Authorization: @token }
  #   end
  #   assert_response :ok
  # end

  # test "should not POST /games/:game_id/cards if not owner" do
  #   assert_difference("Player.count", 0) do
  #     post api_v1_game_cards_url(game_id: @game.id),
  #       params: { player: {name: @card.name, description: @card.description, email: @card.email}},
  #       headers: { Authorization: @token_other }
  #   end
  #   assert_response :forbidden
  # end

  # test "should not POST /games/:game_id/cards without token" do
  #   assert_difference("Player.count", 0) do
  #     post api_v1_game_cards_url(game_id: @game.id),
  #       params: { player: {name: @card.name, description: @card.description, email: @card.email}}
  #   end
  #   assert_response :forbidden
  # end

  # GET /games/:game_id/cards/:id

  test "should not GET /games/:game_id/cards/:id without token" do
    get api_v1_game_card_url(game_id: @game.id, id: @card.id)
    assert_response :forbidden
  end

  test "should not GET /games/:game_id/cards/:id if not owner" do
    get api_v1_game_card_url(game_id: @game.id, id: @card.id), headers: { Authorization: @token_other }
    assert_response :forbidden
  end

  test "should GET /games/:game_id/cards/:id" do
    get api_v1_game_card_url(game_id: @game.id, id: @card.id), headers: { Authorization: @token }
    assert_response :ok
  end

  # PATCH /games/:game_id/cards/:id

  test "should not PATCH /games/:game_id/cards/:id without token" do
    patch api_v1_game_card_url(game_id: @game.id, id: @card.id),
      params: { card: {action: @card.action}}
    assert_response :forbidden
  end

  test "should not PATCH /games/:game_id/cards/:id if not owner" do
    patch api_v1_game_card_url(game_id: @game.id, id: @card.id),
      params: { card: {action: @card.action}},
      headers: { Authorization: @token_other }

    assert_response :forbidden
  end

  test "should PATCH /games/:game_id/cards/:id" do
    patch api_v1_game_card_url(game_id: @game.id, id: @card.id),
      params: { card: {action: @card.action}},
      headers: { Authorization: @token }

    assert_response :ok
  end

  # DELETE /games/:game_id/cards/:id

  # test "should not DELETE /games/:game_id/cards/:id without token" do
  #   delete api_v1_game_card_url(game_id: @game.id, id: @card.id)
  #   assert_response :forbidden
  # end

  # test "should not DELETE /games/:game_id/cards/:id if not owner" do
  #   delete api_v1_game_card_url(game_id: @game.id, id: @card.id), headers: { Authorization: @token_other }
  #   assert_response :forbidden
  # end

  # test "should DELETE /games/:game_id/cards/:id" do
  #   assert_difference("Player.count", -1) do
  #     delete api_v1_game_card_url(game_id: @game.id, id: @card.id), headers: { Authorization: @token }
  #   end
  #   assert_response 204
  # end
end
