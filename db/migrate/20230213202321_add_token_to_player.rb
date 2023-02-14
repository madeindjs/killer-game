class AddTokenToPlayer < ActiveRecord::Migration[7.0]
  def change
    add_column :players, :token, :string
  end
end
