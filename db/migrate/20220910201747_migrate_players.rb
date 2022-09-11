class MigratePlayers < ActiveRecord::Migration[7.0]
  def change
    Game.all.each do |game|

      game.players_list.each do |player|
        name = player.split(',')[0].strip
        description = nil
        description = player.split(',')[1..-1].join(',').strip if player.include?(',')

        Player.create! game: game, name: name, description: description
      end
    end

    remove_column :games, :players
  end
end
