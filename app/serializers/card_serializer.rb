class CardSerializer
  include JSONAPI::Serializer
  attributes :action, :target_id, :player_id, :done_at, :created_at, :updated_at
  belongs_to :player
  belongs_to :target, record_type: :player, serializer: PlayerSerializer
  belongs_to :game
end
