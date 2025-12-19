import cron from "cron";
import https from "https";

export const job = new cron.CronJob("*/10 * * * * *", () => {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log("API is running");
      } else {
        console.log("API is not running");
      }
    })
    .on("error", (err) => {
      console.log("API is not running", err);
    });
});
