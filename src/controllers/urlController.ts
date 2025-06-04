import { Request, Response } from "express";
import { shortUrlWithSalt } from "../services/shortUrlGenerator";
import { db } from "../drizzle/db";
import { UrlSchema } from "../drizzle/schemas/urlSchema";
import { eq } from "drizzle-orm";

export const generateShortUrl = async (req: Request, res: Response) => {
  const { longUrl } = req.body;

  if (!longUrl) {
    res.status(400).json({
      message: "No Long Url found",
    });
    return;
  }

  let retries = 0;
  let newShortUrl;

  try {
    while (retries <= 5) {
      try {
        const generatedShortUrl = shortUrlWithSalt(longUrl);

        newShortUrl = await db
          .insert(UrlSchema)
          .values({
            longUrl: longUrl,
            shortUrl: generatedShortUrl,
          })
          .returning();

        console.log(newShortUrl[0]);
        break;
      } catch (error) {
        console.error("Retry attempt:", retries, error);
        retries++;

        if (retries > 5) {
          throw new Error(
            "Failed to generate unique short URL after 5 attempts"
          );
        }
      }
    }

    if (newShortUrl && newShortUrl.length > 0) {
      res.status(201).json({
        message: "Short url generated",
        shortUrl: newShortUrl[0].shortUrl,
      });
      return;
    } else {
      res.status(500).json({
        message: "Failed to generate short URL",
      });
      return;
    }
  } catch (error) {
    console.error("Error generating short URL:", error);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};

export const getLongUrl = async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  if (!shortUrl) {
    console.log("no short url");
    res.status(400).json({
      message: "Short URL is required",
    });
    return;
  }

  console.log("shortUrl", shortUrl);

  try {
    const LongUrlFromDb = await db
      .select()
      .from(UrlSchema)
      .where(eq(UrlSchema.shortUrl, shortUrl))
      .limit(1);

    if (LongUrlFromDb.length === 0) {
      res.status(400).json({
        message: "Short URL not found",
      });
      return;
    }

    const urlRecord = LongUrlFromDb[0];
    console.log("urlRecord", urlRecord);

    res.status(200).json({
      success: true,
      data: {
        id: urlRecord.id,
        longUrl: urlRecord.longUrl,
        shortUrl: urlRecord.shortUrl,
      },
    });
    return;
  } catch (error) {
    console.error("Error retrieving short URL:", error);
    res.status(500).json({
      message: "Internal server error",
    });
    return;
  }
};
