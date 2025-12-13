import { ratelimit } from "../config/upstash.js";

export const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimit.limit("wallet-api", req.ip);
    if (!success)
      return res
        .status(429)
        .json({ message: "Too many requests. Please, try again later." });
    next();
  } catch (error) {
    console.error("Error while rate limiting: ", error);
    next(error);
  }
};
