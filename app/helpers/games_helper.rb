include ERB::Util

module GamesHelper
  def kill_word
    t('game.kill_words').sample
  end

  def games_link
    link_to t('games.index.title'), games_path
  end

  def game_link game
    link_to game.name, game_path(game.id)
  end
end
