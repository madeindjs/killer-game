class AddTargetActionPreferencesToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :target_action_preferences, :text
  end
end
