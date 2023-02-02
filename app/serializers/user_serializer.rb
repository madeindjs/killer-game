class UserSerializer
  include JSONAPI::Serializer
  attributes :email, :name, :created_at, :updated_at
end
