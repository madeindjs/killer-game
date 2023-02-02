class Api::V1::UsersController < Api::ApiController

  def create
    params.require(:user).permit(:email, :password)

    email = params[:user][:email]
    password = params[:user][:password]

    user = User.new email: email, password: password, password_confirmation: password

    if user.save
      render json: UserSerializer.new(user).serializable_hash
    else
      render json: user.errors, status: :unprocessable_entity
    end
  end
end
