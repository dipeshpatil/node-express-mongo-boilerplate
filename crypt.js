const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const { Transform } = require("stream");

if (![process.env.NODE_ENV, process.env.APP_ENV].includes("production"))
  require("dotenv").config({ path: "./config/environments/.env" });

class AppendInitVect extends Transform {
  constructor(initVect, opts) {
    super(opts);
    this.initVect = initVect;
    this.appended = false;
  }

  _transform(chunk, encoding, cb) {
    if (!this.appended) {
      this.push(this.initVect);
      this.appended = true;
    }
    this.push(chunk);
    cb();
  }
}

function getCipherKey(password) {
  return crypto.createHash("sha256").update(password).digest();
}

function encrypt({ file, password }) {
  const initVect = crypto.randomBytes(16);
  const CIPHER_KEY = getCipherKey(password);
  const readStream = fs.createReadStream(file);
  const gzip = zlib.createGzip();
  const cipher = crypto.createCipheriv("aes256", CIPHER_KEY, initVect);
  const appendInitVect = new AppendInitVect(initVect);
  const writeStream = fs.createWriteStream(path.join(file + ".enc"));

  readStream.pipe(gzip).pipe(cipher).pipe(appendInitVect).pipe(writeStream);
}

function decrypt({ file, password }) {
  const readInitVect = fs.createReadStream(file, { end: 15 });

  let initVect;
  readInitVect.on("data", (chunk) => {
    initVect = chunk;
  });

  readInitVect.on("close", () => {
    const cipherKey = getCipherKey(password);
    const readStream = fs.createReadStream(file, { start: 16 });
    const decipher = crypto.createDecipheriv("aes256", cipherKey, initVect);
    const unzip = zlib.createUnzip();
    const writeStream = fs.createWriteStream(file.split(".enc")[0]);

    readStream.pipe(decipher).pipe(unzip).pipe(writeStream);
  });
}

if (process.env.TYPE === "decrypt") {
  decrypt({
    file: `./config/environments/config.${
      process.env.NODE_ENV ?? process.env.APP_ENV
    }.yml.enc`,
    password: process.env.CIPHER_KEY,
  });
} else {
  encrypt({
    file: `./config/environments/config.${
      process.env.NODE_ENV ?? process.env.APP_ENV
    }.yml`,
    password: process.env.CIPHER_KEY,
  });
}
