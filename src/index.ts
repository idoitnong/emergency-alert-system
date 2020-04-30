import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import "dotenv/config";

// Controllers (route handlers)
import * as powerOutageController from "./controllers/PowerOutage";

const app = express();

const apiToken = process.env.API_TOKEN;

// Express 설정
app.set("port", process.env.PORT || 3000);
app.use(morgan("dev")); // logger
app.use(bodyParser.json()); // body-parser
app.use(bodyParser.urlencoded({ extended: false })); // 'content-type':'application/x-www-form-urlencoded;'

app.get(`/${apiToken}/onBattery`, powerOutageController.onBattery);
app.get(`/${apiToken}/offBattery`, powerOutageController.offBattery);

// 라우팅 되지 않은 페이지들은 전부 404 에러 반환
app.use((req, res, next) => {
  res.status(404).send();
  next();
});

app.listen(app.get("port"), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
