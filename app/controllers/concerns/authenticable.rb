require 'json_web_token'

module Authenticable
  def current_user
    return @current_user if @current_user

    header = request.headers['Authorization']
    raise Pundit::NotAuthorizedError if header.nil?

    decoded = JsonWebToken.decode(header.sub('Bearer ', ''))

    @current_user = begin
                      User.find(decoded[:user_id])
                    rescue StandardError
                      nil
                    end
  end
end