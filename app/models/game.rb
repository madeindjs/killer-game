class Game < ApplicationRecord
  has_many :cards, dependent: :destroy
  has_many :players, dependent: :destroy
  belongs_to :user
  # belongs_to :previous_card, class_name: 'Card', optional: true

  before_save :send_start_mails, if: :started_at_changed?

  validates :actions, presence: true

  # before_validation(on: :create) do
  #   self.token = SecureRandom.uuid
  # end
  after_create do |game|
    return if Rails.env.testing?

    msg = "New game created #{game.name} from #{game.user.email}"

    Ntfy.new('the-killer-online').send(msg) if Rails.env.production?
    Ntfy.new('the-killer-online_dev').send(msg) if Rails.env.development?
  end

  # TODO: use scope
  def alive_players
    Card.includes(:target).where(done_at: nil).map(&:target)
  end

  # TODO: use scope
  def dead_players
    Card.includes(:target).where.not(done_at: nil).map(&:target)
  end

  def get_actions_list
    actions.split("\n")
  end

  def cards_done
    cards.filter(&:done_at)
  end

  def started?
    !started_at.nil?
  end

  def start!
    update(started_at: Time.now)
  end

  def is_alive? player
    !cards_done.any? {|card| card.target === player}
  end

  def get_dashboard2
    res = []

    current_player = nil

    previous_done = false

    Card.includes(player: :victim_card).order('players.position').where(game_id: id).each do |card|
      if card.done?
        if previous_done
          res.last[:cards] << card
        else
          res << {current: nil, cards: [card], player: card.player}
        end

        previous_done = true
      elsif previous_done
        previous_done = false
        res.last[:current] = card

      elsif !card.player.dead?
        previous_done = false
        res << {current: card, cards: [], player: card.player}
      end
    end

    top_score =  res.map{|row| row[:cards].size}.sort.reverse

    res.each do |row|
      row[:rank] = top_score.index(row[:cards].size) + 1
    end unless top_score[0] == 0

    return res
  end

  def random_action
    get_actions_list().shuffle.first
  end

  def can_start?
    players.size > 1
  end

  def send_start_mails
    return unless started?

    cards.each do |card|
      CardsMailer.start(card).deliver_later
    end
  end

end
