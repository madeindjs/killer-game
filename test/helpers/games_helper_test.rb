require "test_helper"

class GamesHelperTest < ActionView::TestCase
  test "should get player name" do
    assert_equal 'foo bar', player_name('foo bar')
    assert_equal 'foo bar', player_name('foo bar, desc')
    assert_equal 'foo bar', player_name('foo bar , desc, and so on')
  end

  test "should get player description" do
    assert_equal '', player_description('foo bar')
    assert_equal 'a pretty little thing', player_description('foo bar, a pretty little thing')
    assert_equal 'a pretty little thing, and more', player_description('foo bar , a pretty little thing, and more')
  end

  test "should detect player description" do
    assert_not have_player_description?('foo bar')
    assert have_player_description?('foo bar, desc')
    assert have_player_description?('foo bar , desc, and so on')
  end

  test "should build a tooltip" do
    assert_nil player_tooltip_description('foo')
    assert_equal 'data-tooltip="bar"', player_tooltip_description('foo, bar')
    assert_equal 'data-tooltip="bar &quot;special char&quot;"', player_tooltip_description('foo, bar "special char"')
  end
end
