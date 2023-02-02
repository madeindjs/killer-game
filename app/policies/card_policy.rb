# frozen_string_literal: true

class CardPolicy
  attr_reader :user, :record

  def initialize(user, record)
    @user = user
    @record = record
  end

  def index?
    own_game?
  end

  def show?
    own_game?
  end

  def create?
    own_game?
  end

  def new?
    own_game?
  end

  def update?
    own_game?
  end

  def edit?
    own_game?
  end

  def destroy?
    own_game?
  end

  private

  def own_game?
    record.game.user_id == user&.id
  end
end
