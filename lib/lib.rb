def get_csv_path
  if ARGV.length != 1; raise 'Runtime error. Invalid arguments ARGV[]' end
  if ENV["CCSV_DIR"] == nil; raise 'Runtime error. Invalid environment variable. "CCSV_DIR" is required.' end
  "#{ENV["CCSV_DIR"]}/#{ARGV[0]}.csv"
end

def row_to_hash(row)
  row.split(",").map.with_index { |col, i|
    case i
    when 2; { color: col }
    when 7; { space_prefix: col }
    when 8; { space_num: col }
    when 10; { circle_name: col }
    when 12; { author_name: col }
    when 14; { url: col }
    when 21; { space_suffix: case col; when '0'; 'a'; when '1'; 'b'; end }
    when 23; { circle_ms_url: col }
    when 26; { twitter_url: col }
    when 27; { pixiv_url: col }
    else {}
    end
  }.reduce{|p, c| p.merge c }
end

def a_to_hash(c_arr)
  {
    catalog_version: c_arr.first,
    checks: c_arr.select{|row| row.index('Circle') == 0}.map{|row| row_to_hash(row)}
  }
end

require 'kconv'
def csv_to_a(csv_path = get_csv_path)
  File.open(csv_path) do |file|
    file.read.toutf8.split("\r\n")
  end
end
