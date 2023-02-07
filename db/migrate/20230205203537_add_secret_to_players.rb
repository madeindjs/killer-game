class AddSecretToPlayers < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :secret, :integer, unsigned: true
  end
end
