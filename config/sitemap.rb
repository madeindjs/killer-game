# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://killer.online"




SitemapGenerator::Sitemap.create do

  add help_path(locale: nil), priority: 0.7, changefreq: :monthly
  add actions_path(locale: nil), priority: 0.7, changefreq: :monthly
  add api_doc_path(locale: nil), :priority => 0.5, :changefreq => 'monthly'


  group(sitemaps_path: 'en/', filename: :en) do
    add root_path(locale: :en), priority: 1.0, changefreq: :monthly
    add help_path(locale: :en), priority: 0.7, changefreq: :monthly
    add actions_path(locale: nil), priority: 0.7, changefreq: :monthly
    add new_user_registration_path(locale: :en), priority: 0.2, changefreq: :monthly
    add new_user_session_path(locale: :en), priority: 0.2, changefreq: :monthly
  end

  group(sitemaps_path: 'fr/', filename: :fr) do
    add root_path(locale: :fr), priority: 1.0, changefreq: :monthly
    add help_path(locale: :fr), priority: 0.7, changefreq: :monthly
    add actions_path(locale: :fr), priority: 0.7, changefreq: :monthly
    add new_user_registration_path(locale: :fr), priority: 0.2, changefreq: :monthly
    add new_user_session_path(locale: :fr), priority: 0.2, changefreq: :monthly
  end


  #
  # Add all articles:
  #
  #   Article.find_each do |article|
  #     add article_path(article), :lastmod => article.updated_at
  #   end
end
