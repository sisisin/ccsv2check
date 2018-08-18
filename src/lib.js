const promisify = require('util').promisify
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)
const iconv = require('iconv-lite')

async function main() {
  const csv = await readFromCatalomCsv()
  console.log(toRenderString(parse(csv)))
}

function getCsvPath() {
  if (process.argv.length !== 3) { throw new Error('Runtime error. Invalid command line args.') }
  if (!process.env['CCSV_DIR']) { throw new Error('Runtime error. Invalid environment variable. "CCSV_DIR" is required.') }
  return `${process.env['CCSV_DIR']}/${process.argv[2]}.csv`
}

async function readFromCatalomCsv(csvPathArg) {
  const csvPath = csvPathArg ? csvPathArg : getCsvPath()
  return iconv.decode(await readFileAsync(csvPath), 'shift_jis')
}

function parse(rawCsv) {
  const rows = rawCsv.split('\r\n').map(row => row.split(','))
  const header = new Header(rows.find(row => row.indexOf('Header') === 0))

  const colors = (() => {
    const entries = rows
      .filter(row => row.indexOf('Color') === 0)
      .map(row => {
        const c = new Color(Number(row[1]), row[2], row[4]);
        return [c.colorNumber, c];
      });
    return new Map(entries);
  })()

  const circles = rows.filter(row => row.indexOf('Circle') === 0)
    .map(row => Circle.parse(row))

  const unknowns = rows.filter(row => row.indexOf('UnKnown') === 0)
    .map(row => UnKnown.parse(row))

  return { header, colors, circles, unknowns }
}

function toRenderString({ circles, colors }) {
  return 'color,pre,num,suf,name,author,url,circle_ms_url,memo\n' +
    circles.map(c => toCsvString(c)).join('\n')

  function toCsvString(circle) {
    return [colors.get(circle.colorNumber).colorName, circle.spacePrefix, circle.spaceNum, circle.spaceSuffix, circle.circleName, circle.authorName, circle.url, circle.circleMsUrl, circle.memo].join(',');
  }
}

class Row { }
class Header extends Row {
  constructor(headerItems) {
    super()
    this.headerItems = headerItems
  }
}

class Color extends Row {
  constructor(colorNumber, colorCode, colorName) {
    super()
    this.colorNumber = colorNumber
    this.colorCode = colorCode
    this.colorName = colorName
  }
}

class CircleData extends Row {
  static parse(arr) {
    const arg = {
      colorNumber: Number(arr[2]),
      spacePrefix: arr[7],
      spaceNum: arr[8],
      circleName: arr[10],
      authorName: arr[12],
      url: arr[14],
      memo: arr[17],
      spaceSuffix: arr[21] === '0' ? 'a' : 'b',
      circleMsUrl: arr[23],
      twitterUrl: arr[26],
      pixivUrl: arr[27],
    }
    return new this(arg)
  }

  constructor({
    colorNumber, spacePrefix, spaceNum, circleName, authorName,
    url, memo, spaceSuffix, circleMsUrl, twitterUrl, pixivUrl
  }) {
    super()
    this.colorNumber = colorNumber
    this.spacePrefix = spacePrefix
    this.spaceNum = spaceNum
    this.circleName = circleName
    this.authorName = authorName
    this.url = url
    this.memo = memo
    this.spaceSuffix = spaceSuffix
    this.circleMsUrl = circleMsUrl
    this.twitterUrl = twitterUrl
    this.pixivUrl = pixivUrl
  }
}

class Circle extends CircleData { }
class UnKnown extends CircleData { }

module.exports = {
  // for application
  main, 

  // for tests
  readFromCatalomCsv, parse, Color, Header, Circle, UnKnown, toRenderString
}
