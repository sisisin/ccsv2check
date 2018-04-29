const expect = require('chai').expect
const { readFromCatalomCsv, parse, toRenderString } = require('../src/lib')

describe('e2e', () => {
  it('should get csv string', async () => {
    const csv = await readFromCatalomCsv('./test/csvs/sample.csv')
    const csvString = toRenderString(parse(csv))
    expect(csvString).to.eq(`color,space_prefix,space_num,space_suffix,circle_name,author_name,url,circle_ms_url
1,Ａ,1,a,おでんランチ。,あむぱか,http://pixiv.me/otuok_panda_mp,https://twitter.com/amupaka
1,Ａ,27,a,スタヂオK-ing,,http://www.sam.hi-ho.ne.jp/kimura/,`)
  })
})
