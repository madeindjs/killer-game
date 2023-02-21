require 'uri'
require 'net/http'

class Ntfy
  def initialize topic, server = "ntfy.sh"
    @topic = topic
    @server = server
  end

  def send message
    uri = URI("https://#{@server}/#{@topic}")

    https = Net::HTTP.new(uri.host, uri.port)
    https.use_ssl = true

    request = Net::HTTP::Post.new(uri.path)
    request.body = message

    response = https.request(request)
  end
end