const fs = require('fs');
const cp = require('node:child_process');
const childProcess = require('child_process');
const UPX = require('upx')('better');
const { compile } = require('nexe');

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function compileBuild(){
  return new Promise((resolve) => {
    compile({
      input: 'core/main.js',
      output: 'Server-Uncompressed',
      build: false,
      verbose: true,
      targets:'windows-x64-12.18.2',
      ico: 'dev/res/icon.ico'
    }).then(function(err) {
      console.log(' ');
      console.log('\x1b[32m√ Server Compiled!\x1b[0m');
      cp.execFile('dev/bin/ResourceHacker.exe', [
        '-open',
        'Server-Uncompressed.exe',
        '-save',
        'Server-Icon.exe',
        '-action',
        'addoverwrite',
        '-res',
        'dev/res/icon.ico',
        '-mask',
        'ICONGROUP,MAINICON,'
      ], function(err) {
        console.log('\x1b[32m√ Icon Changed!\x1b[0m');
        UPX('Server-Icon.exe')
          .output('Server.exe')
          .start().then(function(stats) {
            console.log(stats);
            console.log('\x1b[32m√ Server Compressed!\x1b[0m');		

          }).finally(() => {
            resolve();
          }).catch(function (err) {
            console.log(err);
          });
      });
    });
  });
}
function DrawSpacingHeader(text){
  console.log('============================================================');
  console.log(`=== | ${text} |`);
  console.log('============================================================');
}

async function main(){
  console.log('============================================================');
  let i = 1;
  while(!fs.existsSync('./core')){
    console.log(`=== | Waiting core [${i++}]`);
    await sleep(500);
  }
	
  console.log('============================================================');


  DrawSpacingHeader('\x1b[34m Starting Server Building!\x1b[0m');

  await compileBuild();

  DrawSpacingHeader('\x1b[32m√ Compilation Finished!\x1b[0m');

  while(!fs.existsSync('./core')){
    console.log(`Waiting [${i++}]`);
    await sleep(500);
  }
}

main();
