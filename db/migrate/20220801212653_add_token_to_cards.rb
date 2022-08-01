class AddTokenToCards < ActiveRecord::Migration[7.0]
  def change
    add_column :cards, :token, :string
  end
end
