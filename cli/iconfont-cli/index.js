const path = require('path')
const fs = require('fs')
const http = require('http')
const { createInterface } = require('readline')

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
})

/** 设置 生成iconfont 组件 */
function setVueIconfont() {
  readline.question(`font_class_url: `, (url) => {

    url = url.replace(/([http]?s?:?\/\/)/, 'http://')

    http.get(url, (res) => {
      res.setEncoding('utf8')
      let rawData = ''
      res.on('data', (chunk) => {
        rawData += chunk
      })

      res.on('end', () => {
        try {
          const icfsPath = path.resolve(
            __dirname,
            '../../src/components/Basic/Icon',
          )


          const templateScssPath = path.resolve(
            __dirname,
            './templates/iconfont.scss.template',
          )

          let projectId;
          rawData.replace(/Project id (\d+)/g, (_, $1) => {
            projectId = $1
          })

          fs.readFile(templateScssPath, {}, function (err, data) {
            if (err) throw err;

            let entryItem = []

            rawData.replace(/url.*/g, (_) => {
              entryItem += `\n       ${_}`
            })

            let resultTxt = data.toString('utf8')
              .replace(/\#projectId\#/g, (_) => projectId)
              .replace(/\#FONT_SRC\#/g, (_) => entryItem)

            fs.writeFile(icfsPath + '/src/icon-font.scss', resultTxt, {}, function (err) {
              if (err) throw new Error('❌ icon-font.scss 文件编译失败,\n' + err.message)
              console.log('✅ icon-font.scss 文件编译完成')
            })
          })



          const templateIndexPath = path.resolve(
            __dirname,
            './templates/index.ts.template',
          )

          fs.readFile(templateIndexPath, {}, function (err, data) {
            if (err) throw err;

            let entryItem = ''

            rawData.replace(/.icon\-([\w-]+):before\s\{\n\s+content: "(.*)"/g, (_, $1, $2) => {
              entryItem += `\n  ${$1.toUpperCase().split('-').join('_')} = "&#x${$2}",`
            })

            let resultTxt = data.toString('utf8')
              .replace(/\#projectId\#/g, (_) => projectId)
              .replace(/\#ICON_UNICODE\#/g, (_) => entryItem)

            fs.writeFile(icfsPath + '/index.ts', resultTxt, {}, function (err) {
              if (err) throw new Error('❌ index.ts 文件编译失败,\n' + err.message)
              console.log('✅ index.ts 文件编译完成')
            })
          })
        } catch (e) {
          console.error(e.message)
        }
      })
    })

    readline.close()
  })
}
setVueIconfont()
