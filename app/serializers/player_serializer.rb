class PlayerSerializer
  include JSONAPI::Serializer
  attributes :email, :name, :description, :position, :created_at, :updated_at
end
