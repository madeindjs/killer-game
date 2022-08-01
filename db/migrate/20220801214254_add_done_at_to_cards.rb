class AddDoneAtToCards < ActiveRecord::Migration[7.0]
  def change
    add_column :cards, :done_at, :timestamp
  end
end
