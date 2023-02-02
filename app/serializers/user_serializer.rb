class UserSerializer
  include JSONAPI::Serializer
  attributes :email, :created_at, :updated_at
end
