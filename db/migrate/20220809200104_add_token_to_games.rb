class AddTokenToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :token, :string
  end
end
