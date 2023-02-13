class PlayerSerializer
  include JSONAPI::Serializer
  attributes :email, :name, :description, :token, :position, :created_at, :updated_at
end
