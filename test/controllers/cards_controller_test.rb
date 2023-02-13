require "test_helper"

class CardsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    @card = cards(:one)
  end

  # index

  # test "should not get index cauz not logged" do
  #   get game_cards_url(game_id: @card.game.id)
  #   assert_response :success
  # end

  # test "should not get index cauz not owner" do
  #   sign_in users(:two)
  #   get game_cards_url(game_id: @card.game.id)
  #   assert_response :success
  # end

  # test "should get index" do
  #   sign_in users(:one)
  #   get game_cards_url(game_id: @card.game.id)
  #   assert_response :success
  # end

  # show

  # test "should show card" do
  #   get game_card_url(game_id: @card.game.id, id: @card.token)
  #   assert_response :success
  # end

  # update

  test "should update card" do
    sign_in users(:one)
    patch game_card_url(game_id: @card.game.id, id: @card.id), params: { card: { action: @card.action, game_id: @card.game_id, player: @card.player, target: @card.target } }
    assert_response :redirect
    assert_not_nil flash[:notice]
  end

  test "should not update other field for unlogged users" do
    @card.game.update! started_at: Time.now
    patch game_card_url(game_id: @card.game.id, id: @card.id), params: { card: { action: 'malicious user' } }

    assert_response :redirect
    assert_not_nil flash[:notice]

    @card.reload

    assert_not_equal @card.action, 'malicious user'
  end

  #  done

  # test "should not set done_at when game not started" do
  #   sign_in users(:one)
  #   patch game_card_url(game_id: @card.game.id, id: @card.token), params: { card: { done_at: "1" } }

  #   @card.reload
  #   assert_not @card.done?

  #   assert_response :unprocessable_entity
  #   assert_not_nil flash[:alert]
  # end

  # test "should set done_at when game started for logged users" do
  #   sign_in users(:one)
  #   @card.game.update! started_at: Time.now
  #   patch game_card_url(game_id: @card.game.id, id: @card.token), params: { card: { done_at: "1" } }

  #   @card.reload
  #   assert @card.done?

  #   assert_response :redirect
  #   assert_not_nil flash[:notice]
  # end

  # test "should not set done_at when game started for unlogged users when wrong secret" do
  #   @card.game.update! started_at: Time.now
  #   patch game_card_url(game_id: @card.game.id, id: @card.token), params: { card: { done_at: "1", secret: 1234 } }

  #   @card.reload
  #   assert_not @card.done?

  #   assert_response :redirect
  #   assert_not_nil flash[:danger]
  # end

  # test "should set done_at when game started for unlogged users with good secret" do
  #   @card.game.update! started_at: Time.now
  #   patch game_card_url(game_id: @card.game.id, id: @card.token), params: { card: { done_at: "1", secret: @card.target.secret } }

  #   @card.reload
  #   assert @card.done?

  #   assert_response :redirect
  #   assert_not_nil flash[:notice]
  # end

  #  kill

  test "should kill" do
    @card.game.update! started_at: Time.now

    post game_card_kill_url(game_id: @card.game.id, id: @card.id, token: @card.player.token), params: { secret: @card.target.secret }

    assert_response :redirect
    assert_not_nil flash[:notice]

    @card.reload

    assert_equal @card.player, @card.killed_by
    assert_not_nil @card.done_at
  end

  test "should not kill when game not started" do
    post game_card_kill_url(game_id: @card.game.id, id: @card.id, token: @card.player.token), params: { secret: @card.target.secret }

    assert_response :unprocessable_entity
    assert_not_nil flash[:alert]

    @card.reload

    assert_nil @card.killed_by
    assert_nil @card.done_at
  end

  test "should not kill when wrong secret" do
    @card.game.update! started_at: Time.now

    post game_card_kill_url(game_id: @card.game.id, id: @card.id, token: @card.player.token), params: { secret: 'blabla' }

    assert_response :unprocessable_entity
    assert_not_nil flash[:alert]

    @card.reload

    assert_nil @card.killed_by
    assert_nil @card.done_at
  end
end
