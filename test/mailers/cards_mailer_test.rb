require "test_helper"

class CardsMailerTest < ActionMailer::TestCase
  test "start" do
    card = cards(:one)

    mail = CardsMailer.start card
    assert_equal [card.player.email], mail.to
    assert_equal ["from@example.com"], mail.from
    # assert_match "Hi", mail.body.encoded
  end

end
