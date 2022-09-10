class AddPlayerToCards < ActiveRecord::Migration[7.0]
  def change
    Card.destroy_all

    add_reference :cards, :player, foreign_key: { to_table: :players }
    add_reference :cards, :target, foreign_key: { to_table: :players }

    remove_column :cards, :player
    remove_column :cards, :target
  end
end
