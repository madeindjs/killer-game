class CreateCards < ActiveRecord::Migration[7.0]
  def change
    create_table :cards do |t|
      t.references :game, null: false, foreign_key: true
      t.string :player
      t.string :target
      t.string :action

      t.timestamps
    end
  end
end
