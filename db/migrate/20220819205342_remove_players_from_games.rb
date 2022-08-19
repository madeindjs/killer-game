class RemovePlayersFromGames < ActiveRecord::Migration[7.0]
  def change
    remove_column :games, :players
  end
end
