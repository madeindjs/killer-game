class AddSecretToPlayers < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :secret, :integer, unsigned: true, not_null: true
  end
end
