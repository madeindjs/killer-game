module PlayersHelper

  def players_link game
    link_to t('players.index.title'), players_path(game)
  end

  def players_path game
    game_player_path(game_id: game.id)
  end

  def player_path player
    game_player_path(game_id: player.game_id, id: player.id)
  end

  def player_link player
    link_to player.name, game_player_path(game_id: player.game_id, id: player.id)
  end

  def player_dashboard_link player
    link_to '👀', player_dashboard_path(token: player.token)
  end
end
