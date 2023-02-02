class PlayerSerializer
  include JSONAPI::Serializer
  attributes :email, :name, :description, :created_at, :updated_at
end
