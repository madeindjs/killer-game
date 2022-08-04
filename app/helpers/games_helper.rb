module GamesHelper



  def kill_word
    kill_words = [
      "s'est fait démonter",
      "s'est fait monter en l'air",
      "s'est fait niquer",
      "ne l'a pas vu venir",
    ]
    kill_words.sample
  end
end
