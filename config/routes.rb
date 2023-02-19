Rails.application.routes.draw do
  get 'admin', to: 'admin#index', as: :admin_index

  # get '/games/:game_id/cards/:token', to:
  scope "(:locale)", locale: /en|fr/ do
    devise_for :users
    resources :games do
      resources :cards, only: %i[index edit update]
      post 'kill/:token', to: 'cards#kill', as: :card_kill
      resources :players, only: %i[edit create update destroy]
    end

    # pages
    get 'pages/home'
    get 'help', to: 'pages#help', as: :help
    get 'api-doc', to: 'pages#api_doc', as: :api_doc
    get 'actions', to: 'pages#actions', as: :actions

    get 'games/:token/dashboard', to: 'players#dashboard', as: :player_dashboard
    # get 'cards/:token', to: 'cards#show', as: :public_card
    # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
    root "pages#home"
  end

  namespace "api" do
    namespace "v1", defaults: {format: :json} do
      resources :users, only: [:create]
      resources :tokens, only: [:index, :create]
      resources :games do
        get 'dashboard', to: 'games#dashboard'
        resources :players do
          get 'cards', to: "cards#index_for_player"
        end
        resources :cards, only: %i[show index update]
      end
    end
  end


  # Defines the root path route ("/")
end
