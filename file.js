const fs = require("fs");

const readFileSync = function(path, options = {encoding: null, flag: "r"}) {
  try {
    const content = fs.readFileSync(path, options);
    return {
      bytesRead: content.length,
      data: content
    };
  } catch (err) {
    return {
      bytesRead: 0,
      data: null,
      message: err.message
    };
  }
}

const readFileAsync = async function(path, options = {encoding: null, flag: "r"}) {
  return new Promise((resolve) => {
    const content = readFileSync(path, options);
    resolve(content);
  });
}

const readSync = function(fd, outBuffer, offset, count, position) {
  try {
    const bytesRead = fs.readSync(fd, outBuffer, offset, count, position);
    return {
      bytesRead: bytesRead,
      data: outBuffer
    };
  } catch (error) {
    return {
      bytesRead: 0,
      data: outBuffer,
      message: error.message
    };
  }
}

const readAsync = function(fd, outBuffer, offset, count, position) {
  return new Promise((resolve) => {
    fs.read(fd, outBuffer, offset, count, position, (err, bytesRead, buffer) => {
      resolve({
        bytesRead: err ? 0 : bytesRead,
        data: err ? null : buffer,
        message: err ? err.message : null
      });
    });
  });
}

const openFileSync = function(path, flags, mode) {
  try {
    const fd = fs.openSync(path, flags, mode);
    return {
      opened: true,
      fd: fd
    };
  } catch (error) {
    return {
      opened: false,
      fd: null,
      message: error.message
    };
  }
}

const openFileAsync = async function(path, flags, mode) {
  return new Promise((resolve) => {
    try {
      fs.open(path, flags, mode, (err, fd) => {
        resolve({ opened: true, fd: fd });
      });
    } catch (error) {
      resolve({opened: false, fd: null, message: error.message});
    }
  });
}

const closeFileSync = function(fd) {
  try {
    fs.closeSync(fd);
    return {
      closed: true
    };
  } catch (error) {
    return { 
      closed: false,
      message: error.message
    };
  }
}

const closeFileAsync = async function(fd) {
  return new Promise((resolve) => {
    fs.close(fd, (err) => {
      resolve({
        closed: !err,
        message: err ? err.message : null
      });
    })
  });
}

const writeFileSync = function(path, data, options) {
  try {
    fs.writeFileSync(path, data, options);
    return {
      written: true,
      bytesWritten: data.length
    };
  } catch (error) {
    return {
      written: false,
      bytesWritten: 0,
      message: error.message
    };
  }
}

const writeFileAsync = async function(file, data, options) {
  return new Promise((resolve) => {
    fs.writeFile(file, data, options, (err) => {
      resolve({
        written: !err,
        bytesWritten: err ? 0 : data.length,
        message: err ? err.message : null
      });
    });
  });
}

const writeSync = function() {
  try {
    const bytesWritten = fs.writeSync(...arguments);
    return {
      written: true,
      bytesWritten: bytesWritten
    };
  } catch (error) {
    return {
      written: false,
      bytesWritten: 0,
      message: error.message
    };
  }
}

const writeAsync = async function() {
  const args = [...arguments];
  return new Promise((resolve) => {
    args.push((err, bytesWritten, buffer) => {
      resolve({
        written: !err,
        bytesWritten: err ? 0: buffer.length,
        message: err ? err.message : null
      });
    });
    fs.write(...args);
  });
}

const exists = function(path) {
  return fs.existsSync(path);
}

module.exports = {
  openFileSync,
  openFileAsync,
  closeFileSync,
  closeFileAsync,
  readFileSync,
  readFileAsync,
  readSync,
  readAsync,
  writeFileSync,
  writeFileAsync,
  writeSync,
  writeAsync
};
