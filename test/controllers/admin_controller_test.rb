require "test_helper"

class AdminControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "should not get index when not logged" do
    get admin_index_url
    assert_response :forbidden
  end

  test "should not get index when not admin" do
    sign_in users(:one)
    get admin_index_url
    assert_response :forbidden
  end

  test "should get index" do
    sign_in users(:admin)
    get admin_index_url
    assert_response :success
  end
end
