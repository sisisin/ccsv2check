const expect = require('chai').expect
const { readFromCatalomCsv, Header, Circle, Color, UnKnown, parse , toRenderString} = require('../src/lib')

describe('#readFromCatalomCsv', () => {
  it('should read s-jis file', async () => {
    const sut = await readFromCatalomCsv('./test/csvs/sjis.csv')
    expect(sut).to.eq('Circle,東,ジャポニカ自由帳\r\nCircle,東,Re:Re:Re:\r\n')
  })
})

const samples = {
  header: {
    row: 'Header,ComicMarketCD-ROMCatalog,ComicMarket1608214,Shift_JIS,Windows 1.89.1',
    instance: new Header(['Header', 'ComicMarketCD-ROMCatalog', 'ComicMarket1608214', 'Shift_JIS', 'Windows 1.89.1'])
  },
  color: {
    row: 'Color,1,4a94ff,4a94ff,',
    instance: new Color(1, '4a94ff')
  },
  circle: {
    row: 'Circle,106291,1,174,28,日,東,に,15,999,Happa,,おーみや,,,,,,3507,357,1,1,,http://happa.moo.jp/,https://twitter.com/oomiya,,,,',
    instance: new Circle({
      colorNumber: '1',
      spacePrefix: 'に',
      spaceNum: '15',
      spaceSuffix: 'b',
      circleName: 'Happa',
      authorName: 'おーみや',
      url: '',
      circleMsUrl: 'http://happa.moo.jp/',
      twitterUrl: '',
      pixivUrl: '',
    })
  },
  unknown: {
    row: 'UnKnown,106291,1,174,28,日,東,に,15,999,Happa,,おーみや,,,,,,3507,357,1,1,,http://happa.moo.jp/,https://twitter.com/oomiya,,,,',
    instance: new Circle({
      colorNumber: '1',
      spacePrefix: 'に',
      spaceNum: '15',
      spaceSuffix: 'b',
      circleName: 'Happa',
      authorName: 'おーみや',
      url: '',
      circleMsUrl: 'http://happa.moo.jp/',
      twitterUrl: '',
      pixivUrl: '',
    }),
    instance: new UnKnown({
      colorNumber: '1',
      spacePrefix: 'に',
      spaceNum: '15',
      spaceSuffix: 'b',
      circleName: 'Happa',
      authorName: 'おーみや',
      url: '',
      circleMsUrl: 'http://happa.moo.jp/',
      twitterUrl: '',
      pixivUrl: '',
    })
  }
}

describe('#parse', () => {
  it('should parse csv data', () => {
    const csv = samples.header.row + '\r\n'
      + samples.color.row + '\r\n'
      + samples.circle.row + '\r\n'
      + samples.unknown.row + '\r\n'

    expect(parse(csv)).to.deep.eq({
      header: samples.header.instance,
      colors: [samples.color.instance],
      circles: [samples.circle.instance],
      unknowns: [samples.unknown.instance],
    })
  })
})

describe('#toRenderString', () => {
  it('should return csv string only header when no `circles` data', () => {
    expect(toRenderString({
      header: samples.header.instance,
      colors: [samples.color.instance],
      circles: [],
      unknowns: [samples.unknown.instance],
    })).to.eq('color,space_prefix,space_num,space_suffix,circle_name,author_name,url,circle_ms_url\n')
  })

  it('should return csv string', () => {
    expect(toRenderString({
      circles: [samples.circle.instance],
    })).to.eq('color,space_prefix,space_num,space_suffix,circle_name,author_name,url,circle_ms_url\n1,に,15,b,Happa,おーみや,,http://happa.moo.jp/')
  })
})
