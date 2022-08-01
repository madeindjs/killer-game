class CreateGames < ActiveRecord::Migration[7.0]
  def change
    create_table :games do |t|
      t.string :name
      t.text :players
      t.text :actions

      t.timestamps
    end
  end
end
