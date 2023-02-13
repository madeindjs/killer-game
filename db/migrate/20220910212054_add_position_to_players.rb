class AddPositionToPlayers < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :position, :integer, unsigned: true, not_null: true
  end
end
