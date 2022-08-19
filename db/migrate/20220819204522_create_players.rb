class CreatePlayers < ActiveRecord::Migration[7.0]
  def change
    remove_column :games, :players
    remove_column :cards, :player
    remove_column :cards, :target

    create_table :players do |t|
      t.string :name, required: true, unique: true
      t.text :description
      t.references :game, null: false, foreign_key: true

      t.timestamps
    end

    add_reference :cards, :player, foreign_key: { to_table: :players }
    add_reference :cards, :target, foreign_key: { to_table: :players }
  end
end
