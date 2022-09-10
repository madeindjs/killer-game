json.extract! player, :id, :name, :description, :game_id, :created_at, :updated_at
json.url player_url(player, format: :json)
