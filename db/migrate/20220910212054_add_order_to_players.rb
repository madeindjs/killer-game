class AddOrderToPlayers < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :order, :integer, default: 0
  end
end
