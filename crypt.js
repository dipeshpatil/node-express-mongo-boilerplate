const crypto = require("crypto");
const fs = require("fs");

if (![process.env.NODE_ENV, process.env.APP_ENV].includes("production"))
  require("dotenv").config({ path: "./config/environments/.env" });

const configFilePath = "./config/environments";

const encrypt = ({ fileName }) => {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(
    process.env.CIPHER_KEY,
    salt,
    100000,
    32,
    "sha256"
  );
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const input = fs.readFileSync(`${configFilePath}/${fileName}`);
  const encrypted = Buffer.concat([cipher.update(input), cipher.final()]);

  fs.writeFileSync(
    `${configFilePath}/${fileName}.enc`,
    salt.toString("hex") + iv.toString("hex") + encrypted.toString("hex")
  );
};

const decrypt = ({ fileName }) => {
  const data = fs.readFileSync(`${configFilePath}/${fileName}.enc`);
  const saltHex = data.slice(0, 32).toString("utf8");
  const ivHex = data.slice(32, 64).toString("utf8");
  const encryptedHex = data.slice(64).toString("utf8");
  const derivedKey = crypto.pbkdf2Sync(
    process.env.CIPHER_KEY,
    Buffer.from(saltHex, "hex"),
    100000,
    32,
    "sha256"
  );
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    derivedKey,
    Buffer.from(ivHex, "hex")
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  fs.writeFileSync(`${configFilePath}/${fileName}`, decrypted);
};

(process.env.TYPE === "decrypt" ? decrypt : encrypt)({
  fileName: `config.${process.env.NODE_ENV ?? process.env.APP_ENV}.yml`,
});
