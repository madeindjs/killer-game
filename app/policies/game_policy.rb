# frozen_string_literal: true

class GamePolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    !user.nil?
  end

  def show?
     record.user_id == user&.id
  end

  def create?
    index?
  end

  def new?
    index?
  end

  def update?
    show?
  end

  def edit?
    update?
  end

  def destroy?
    update?
  end
end
