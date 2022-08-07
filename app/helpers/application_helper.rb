module ApplicationHelper
  def is_admin? game
    game.user_id === current_user&.id
  end

  def format_time date
    date.strftime("%H:%M %Z")
  end
end
