import express from "express";
import "dotenv/config";
import urlRouter from "./routes/urlRoutes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello");
});

app.use("/api", urlRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
