require 'json'

begin
  def row_to_hash(row)
    hash = {}
    row.split(",").each_with_index do |col, i|
      case i
      when 1; hash[:color] = col
      when 6; hash[:space_prefix] = col
      when 7; hash[:space_num] = col
      when 9; hash[:circle_name] = col
      when 10; hash[:author_name] = col
      when 12; hash[:url] = col
      end
    end
    hash
  end
  def file_to_hash
    hash = { checks: [] }
    File.open('.tmp/sample.csv') do |file|
      file.each_line do |row|
        if file.lineno == 1 then hash[:catalog_version] = row
        else hash[:checks].push(row_to_hash(row))
        end
      end
    end
    hash
  end

  check_hash = file_to_hash[:checks]
  puts check_hash[0].keys.reduce{|pre, cur| "#{pre}	#{cur}"}
  check_hash.each do |v|
    puts v.map {|k, v| v}.reduce{|pre, cur| "#{pre}	#{cur}"}
  end
end
