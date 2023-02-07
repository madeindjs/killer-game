# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

def create_user email
  User.create!( email: email, password: "20462046",)
end

unless Rails.env.production?
  User.destroy_all

  user = create_user "alexandre@rsseau.fr"

  game = Game.create!(
    name: "Birthday party",
    actions: [
      'boire un shooter 🥃',
      'boire un cul-sec 🥃',
      'danser sur une table 💃',
      'dire une phrase en anglais (ou autre langue étrangère) 🇬🇧',
      'dire une phrase en italien 🇮🇹',
      'danser un moonwalk 🕺',
    ].join("\n"),
    user: user,
  )

  game.players = [
    Player.new(name: 'Alex', user: user),
    Player.new(name: 'Lorène', user: create_user('lorene@rsseau.fr')),
    Player.new(name: 'Sylvain', user: create_user('sylvain@rsseau.fr')),
    Player.new(name: 'Giulia', user: create_user('giulia@rsseau.fr')),
  ]

  game.save
end