class ApplicationController < ActionController::Base
  before_action :set_dashboards


  private

  def set_dashboards
    @dashboards = cookies[:dashboards]&.split(',') || []
  end



  def saw_dashboard token
    cookies[:dashboards] ||= ""
    cookies[:dashboards] = cookies[:dashboards].split(',').push(token).uniq.join(',')
  end
end
