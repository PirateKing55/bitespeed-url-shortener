import { createHash, randomBytes } from "crypto";

export const shortUrlWithSalt = (longUrl: string): string => {
  const salt = randomBytes(8).toString("hex");
  const input = longUrl + salt;
  const hash = createHash("sha256").update(input, "utf8").digest("hex");
  return hash.substring(0, 8);
};

// console.log(shortUrlWithSalt("kdscsfasdfasdjsdnfjsd"));
