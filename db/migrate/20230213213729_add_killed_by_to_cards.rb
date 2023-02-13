class AddKilledByToCards < ActiveRecord::Migration[7.0]
  def change
    add_reference :cards, :killed_by, foreign_key: { to_table: :players }
  end
end
