const shell = require('shelljs');

shell.rm('-rf', 'dist');
const packResult = shell.exec('npm pack --silent', { silent: true });
const packed = packResult.stdout.trim().split('\n').pop();

shell.mv(packed, 'integration');
shell.cd('integration');
shell.rm('-rf', 'node_modules');
shell.exec('npm install');
shell.exec(`npm install ${packed}`);
shell.rm(packed);

shell.set('-e');

// Test
shell.exec('npm test');
shell.exec('npm run build');
