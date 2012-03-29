require 'sinatra'
require 'nokogiri'
require 'pry'
require 'json/ext'

get '/map' do
  content = File.read(File.dirname(__FILE__) + '/map.osm')
  doc = Nokogiri::XML.parse(content)
  nodes = doc.css('node').first(20).map(&:attributes).map { |hash| hash.each { |k,v| hash[k] = v.value } }
  json = nodes.to_json
  File.open('nodes.json', 'w') { |f| f.print json }
  json
end

