class AddUserToCards < ActiveRecord::Migration[7.0]
  def change
    remove_column :cards, :player
    remove_column :cards, :target

    add_reference :cards, :player, foreign_key: { to_table: :players }
    add_reference :cards, :target, foreign_key: { to_table: :players }
  end
end
