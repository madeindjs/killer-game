module ApplicationHelper
  def is_admin?
    # TODO
    true
  end

  def format_time date
    date.strftime("%H:%M %Z")
  end
end
