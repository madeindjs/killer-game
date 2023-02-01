require "test_helper"

class Api::V1::TokensControllerTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
  test "should get token" do
    user = User.create! email: 'test@test.fr', password: 'password', password_confirmation: 'password'

    post api_v1_tokens_url, params: { user: { email: user.email , password: 'password' } }
    assert_response :success
  end

  test "should not get token" do
    user = users(:one)
    post api_v1_tokens_url, params: { user: { email: user.email , password: 'bad' } }
    assert_response :unauthorized
  end
end
