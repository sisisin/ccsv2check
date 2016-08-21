require './lib/lib.rb'
begin
  check_hash = a_to_hash(csv_to_a)[:checks]
  puts check_hash[0].keys.reduce{|pre, cur| "#{pre}	#{cur}"}
  check_hash.each do |v|
    puts v.map {|k, v| v}.reduce{|pre, cur| "#{pre}	#{cur}"}
  end
end
