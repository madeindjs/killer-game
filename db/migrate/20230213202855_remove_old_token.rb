class RemoveOldToken < ActiveRecord::Migration[7.0]
  def change
    remove_column :games, :token, :string
    remove_column :cards, :token, :string
  end
end
