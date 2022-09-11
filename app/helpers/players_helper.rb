module PlayersHelper
  def player_path player
    game_player_path(game_id: player.game_id, id: player.id)
  end
end
