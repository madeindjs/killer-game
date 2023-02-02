class Api::V1::TokensController < Api::ApiController

  def create
    params.require(:user).permit(:email, :password)

    email = params[:user][:email]
    password = params[:user][:password]

    user = User.find_for_authentication(email: email)


    if user&.valid_password?(password)
      render json: {
        token: JsonWebToken.encode({user_id: user.id})
      }
    else
      head :unauthorized
    end
  end
end
