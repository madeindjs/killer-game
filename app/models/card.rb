class Card < ApplicationRecord
  belongs_to :game
  before_validation(on: :create) do
    self.token = SecureRandom.uuid
  end
end
