const fs = require('fs');
const https = require('https');
const querystring = require('querystring');

const HTML = fs.readFileSync('src/index.html','utf-8');
const CSS = fs.readFileSync('src/style.css','utf-8');
const JS = fs.readFileSync('src/script.js','utf-8');
const SVG = fs.readFileSync('src/name.svg','utf-8');

const iToName = i => (
  i.toString(26)
    .replace(/./g, c => String.fromCharCode(parseInt(c, 26)+97) )
);

// const stripWhiteSpace = s => s.replace(/[\n\r]|\s{2,}/g, '');
const stripWhiteSpace = s => (
  s.replace(/[\n\r]/g,' ')
    .replace(/\s{2,}/g,' ')
    .replace(/> </g, '><')
    .replace(/\s*([{}:;=])\s*/g,'$1')
    .replace(/;}/g,'}')
)

function join(html, parts) {
  return Object.keys(parts).reduce( (memo, key)=> (
    memo.replace(`{{${key}}}`, parts[key])
  ), html)
}

// This is definitely a good idea
let classNameMap = {}
let i = 0;
let minCSS = CSS.replace(/\.-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g, (className) => {
  if( ['.flipped','.card-name'].includes(className) ) {
    return className;
  }
  if( className in classNameMap ) {
    return '.'+classNameMap[className];
  }
  const name = iToName(i++);
  classNameMap[className] = name;
  return '.'+name;
});

let minHTML = HTML.replace(/(class=["'])([\w -]*)/g, (a,open,classNames) => {
  return classNames
    .split(' ')
    .reduce( (memo, className) =>
      memo + (classNameMap['.'+className] || className) + ' '
    , open)
    .slice(0, -1);
});
minHTML = stripWhiteSpace(minHTML);

// in for a penny, in for a pound
const postData = querystring.stringify({
  compilation_level: 'ADVANCED_OPTIMIZATIONS',
  output_format: 'text',
  output_info: 'compiled_code',
  js_code: JS
});
var options = {
  hostname: 'closure-compiler.appspot.com',
  port: 443,
  path: '/compile',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
}
console.log('running closure compiler');
const req = https.request(options, (res) => {
  let body = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {

    let out = join(minHTML, {
      'style.css': stripWhiteSpace(minCSS),
      'name.svg': stripWhiteSpace(SVG),
      'script.js': body,
    })

    fs.writeFileSync('./index.html', out);

  });
});
req.write(postData);
req.end();


// fs.writeFileSync('./index.html', out);

// console.log( stripWhiteSpace(out) );
// console.log( stripWhiteSpace(JS) )
// console.log(JSON.stringify(classNameMap))
