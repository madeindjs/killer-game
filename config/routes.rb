Rails.application.routes.draw do

  # get '/games/:game_id/cards/:token', to:
  scope "(:locale)", locale: /en|fr/ do
    devise_for :users
    resources :games do
      resources :cards, only: %i[show index edit update]
      resources :players
    end

    # pages
    get 'pages/home'
    get 'help', to: 'pages#help', as: :help
    get 'actions', to: 'pages#actions', as: :actions

    get 'games/:token/dashboard', to: 'games#dashboard', as: :game_dashboard
    get 'cards/:token', to: 'cards#show', as: :public_card
    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
    root "pages#home"
  end


  # Defines the root path route ("/")
end
