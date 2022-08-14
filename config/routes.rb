Rails.application.routes.draw do
  devise_for :users

  # get '/games/:game_id/cards/:token', to:

  resources :games do
    resources :cards, only: %i[show index edit update]
  end
  get 'pages/home'
  get 'games/:token/dashboard', to: 'games#dashboard', as: :game_dashboard
  get 'cards/:token', to: 'cards#show', as: :public_card
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root "pages#home"
end
