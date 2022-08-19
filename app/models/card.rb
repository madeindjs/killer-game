class Card < ApplicationRecord
  belongs_to :game

  validates :player, presence: true
  validates :action, presence: true
  validates :target, presence: true

  before_validation(on: :create) do
    self.token = SecureRandom.uuid
  end

  def target_name
    target.split(',')[0]
  end

  def target_description
    target.split(',').slice(1).join(',')
  end

  def done?
    !done_at.nil?
  end
end
