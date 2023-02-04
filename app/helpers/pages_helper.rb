module PagesHelper
  def card_done_sentence dashboard_row
    t 'help.card_done_sentence', player: dashboard_row[:player].name, action: dashboard_row[:current].action, target: dashboard_row[:current].target.name
  end

  def card_will_do_sentence dashboard_row
    t 'help.card_will_do_sentence', player: dashboard_row[:player].name, action: dashboard_row[:current].action, target: dashboard_row[:current].target.name
  end

  def edit_player_link player, content = '✏️'
    link_to content, edit_game_player_path(game_id: player.game_id, id: player.id), 'data-tooltip': t('players.edit.title')
  end
end
