class AdminController < ApplicationController
  def index
    redirect_back(fallback_location: root_path, status: :forbidden) unless current_user&.email&.downcase&.ends_with?('@rsseau.fr')

    @users = User.all
  end
end
