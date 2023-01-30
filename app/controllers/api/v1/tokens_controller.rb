class Api::V1::TokensController < Api::ApiController

  def create
    params.permit(:email, :password)

    email = params[:email]
    password = params[:password]

    user = User.find_for_authentication(email: email)

    if user&.valid_password?(params[:password])
      render json: {
        token: JsonWebToken.encode({user: user})
      }
    else
      head :unauthorized
    end
  end
end
