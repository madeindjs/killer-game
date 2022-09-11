include ERB::Util

module GamesHelper
  def kill_word
    t('game.kill_words').sample
  end

  def games_link
    link_to t('games.index.title'), games_path
  end
end
