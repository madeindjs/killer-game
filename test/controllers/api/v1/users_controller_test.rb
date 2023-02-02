require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
  test "should create user" do
    user = User.new email: 'test@test.fr', password: 'password', password_confirmation: 'password'

    assert_difference("User.count", 1) do
      post api_v1_users_url, params: { user: { email: 'test@test.fr', password: 'password' } }
    end
  end

  test "should not create user with an existing email" do
    user = users(:one)

    assert_difference("User.count", 0) do
      post api_v1_users_url, params: { user: { email: user, password: 'password' } }
    end
  end
end
