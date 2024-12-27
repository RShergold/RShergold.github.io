const fs = require('fs');
const HTML = fs.readFileSync('src/index.html','utf-8');

let minHTML = HTML
  .replace(/{{ (.*) }}/g, (_, fileName) => fs.readFileSync('src/'+fileName, 'utf-8') ) // Replace {{ fileName }} with file content
  .replace(/\n/g, '') // Remove newlines
  .replace(/\s{2,}/g, ' ') // Replace multiple whitespaces with a single whitespace
  .replace(/>\s+</g, '><') // Remove whitespaces between tags
  .replace(/>\s+|\s+</g, match => match.trim()) // Remove leading/trailing whitespace inside tags
  .replace(/(\w+)="([^"\s]+)"/g, '$1=$2') // Remove quotes around single-word attributes
  .replace(/(\S)<a/g, '$1 <a') // Ensure <a> tags have a whitespace before them
  .replace(/<\/a>(\S)/g, '</a> $1') // Ensure </a> tags have a whitespace after them


fs.writeFileSync('./index.html', minHTML);