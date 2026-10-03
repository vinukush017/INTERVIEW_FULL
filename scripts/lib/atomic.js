const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

function atomicWrite(file, content, io = fs) {
  const temporary = path.join(path.dirname(file), `.${path.basename(file)}.${randomUUID()}.tmp`);
  let fd;
  try {
    fd = io.openSync(temporary, 'wx', fs.existsSync(file) ? fs.statSync(file).mode & 0o777 : 0o600);
    io.writeFileSync(fd, content); io.fsyncSync(fd); io.closeSync(fd); fd = undefined;
    io.renameSync(temporary, file);
  } finally {
    if (fd !== undefined) io.closeSync(fd);
    if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
  }
}

// Nonblocking cross-process lock. A competing CLI/dashboard save retries;
// stale locks are never silently removed while another process may own them.
function withProgressLock(root, action) {
  const directory = path.join(root, '.progress'); fs.mkdirSync(directory, { recursive: true });
  const lock = path.join(directory, '.write.lock'); let fd;
  try { fd = fs.openSync(lock, 'wx', 0o600); }
  catch (error) {
    if (error.code === 'EEXIST') throw Object.assign(new Error('Progress is being saved. Retry; if the process crashed, inspect .progress/.write.lock before removing it.'), { status: 409 });
    throw error;
  }
  try { fs.writeFileSync(fd, JSON.stringify({ pid: process.pid })); return action(); }
  finally { fs.closeSync(fd); fs.unlinkSync(lock); }
}
module.exports = { atomicWrite, withProgressLock };
