require "test_helper"

class CardsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @card = cards(:one)
  end

  test "should not get index cauz not logged" do
    get game_cards_url(game_id: @card.game.id)
    assert_response :success
  end

  test "should not get index cauz not owner" do
    sign_in users(:two)
    get game_cards_url(game_id: @card.game.id)
    assert_response :success
  end

  test "should get index" do
    sign_in users(:one)
    get game_cards_url(game_id: @card.game.id)
    assert_response :success
  end

  test "should show card" do
    get game_card_url(game_id: @card.game.id, id: @card.token)
    assert_response :success
    @card.reload
    assert_not_nil @card.done_at
  end


  test "should update card" do
    sign_in users(:one)
    patch game_card_url(game_id: @card.game.id, id: @card.token), params: { card: { action: @card.action, game_id: @card.game_id, player: @card.player, target: @card.target } }
    assert_response :redirect
  end
end
