class GameSerializer
  include JSONAPI::Serializer
  attributes :name, :actions, :user_id, :created_at, :updated_at, :started_at
  belongs_to :user
end
