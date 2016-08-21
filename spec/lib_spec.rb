require_relative '../lib/lib'

describe 'csv_to_a' do
  it 'should read shift-jis file' do
    expect(csv_to_a('./spec/csvs/sjis.csv')).to eq ['Circle,東,ジャポニカ自由帳', 'Circle,東,Re:Re:Re:']
  end
end


describe 'row_to_hash' do
  it 'should return hash' do
    test_row = "Circle,106291,1,174,28,日,東,に,15,999,Happa,,おーみや,,,,,,3507,357,1,1,,http://happa.moo.jp/,https://twitter.com/oomiya,,,,"
    expect_hash = {
      color: '1',
      space_prefix: 'に',
      space_num: '15',
      circle_name: 'Happa',
      author_name: 'おーみや',
      url: '',
      circle_ms_url: 'http://happa.moo.jp/'
    }
    expect(row_to_hash(test_row)).to eq expect_hash 
  end
end

describe 'a_to_hash' do
  sample = csv_to_a 'spec/csvs/sample.csv'
  sut = a_to_hash sample

  it 'should have :catalog_version' do
    expect(sut[:catalog_version]).to eq sample[0]
  end

  it 'should have :checks based sample.csv' do
    test_checks = [{
      color: '1',
      space_prefix: 'Ａ',
      space_num: '1',
      circle_name: 'おでんランチ。',
      author_name: 'あむぱか',
      url: 'http://pixiv.me/otuok_panda_mp',
      circle_ms_url: 'https://twitter.com/amupaka'
    },
    {
      color: '1',
      space_prefix: 'Ａ',
      space_num: '27',
      circle_name: 'スタヂオK-ing',
      author_name: '',
      url: 'http://www.sam.hi-ho.ne.jp/kimura/'
    }]
    expect(sut[:checks]).to eq test_checks
  end
end
