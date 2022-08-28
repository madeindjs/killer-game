include ERB::Util

module GamesHelper
  def kill_word
    t('game.kill_words').sample
  end

  def player_name player
    player.split(',')[0].strip
  end

  def player_description player
    player.split(',')[1..-1].join(',').strip
  end

  def player_pretty player
    sentence = [player_name(player)]
    sentence << "(#{player_description(player)})" if have_player_description?(player)
    sentence.join(' ')
  end

  def have_player_description? player
    player.include?(',')
  end

  def player_tooltip_description player
    return nil unless have_player_description?(player)

    ('data-tooltip="%s"' % [h(player_description(player))]).html_safe
  end
end
