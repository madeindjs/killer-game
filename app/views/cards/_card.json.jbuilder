json.extract! card, :id, :game_id, :player, :target, :action, :created_at, :updated_at
json.url card_url(card, format: :json)
