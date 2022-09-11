require "test_helper"

class CardsMailerTest < ActionMailer::TestCase
  test "start" do
    mail = CardsMailer.start
    assert_equal "Start", mail.subject
    assert_equal ["to@example.org"], mail.to
    assert_equal ["from@example.com"], mail.from
    assert_match "Hi", mail.body.encoded
  end

end
