import express from "express";
import twilio from "twilio";
import morgan from "morgan";
import bodyParser from "body-parser";
import "dotenv/config";

const accountSid = process.env.ACCOUNT_SID || "YOUR_ACCOUNT_SID";
const authToken = process.env.AUTH_TOKEN || "YOUT_AUTH_TOKEN";

const app = express();
const client = twilio(accountSid, authToken);

let flag = false; // 정전 상태

// Express 설정
app.set("port", process.env.PORT || 3000);
app.use(morgan("dev")); // logger
app.use(bodyParser.json()); // body-parser
app.use(bodyParser.urlencoded({ extended: false }));

app.get(`/twilio${accountSid}/Call`, (req, res) => {
  console.log("전화를 걸라고 요청이 들어왔어요.");
  flag = true;
  setTimeout(() => {
    if (flag) {
      console.log("전화를 걸게요.");
      client.calls
        .create({
          statusCallback: `http://${process.env.STATUS_CALLBACK_URL_HOST}/events`,
          statusCallbackEvent: ["completed"],
          statusCallbackMethod: "POST",
          twiml: `<Response><Say voice="woman" loop="10" language="ko-KR">하우스에 정전이 발생했습니다.</Say></Response>`,
          to: process.env.MY_PHONE_NUMBER,
          from: process.env.TWILIO_PHONE_NUMBER,
        })
        .then((call) => console.log(call.sid))
        .catch((call) => console.log(call));
      flag = false;
    } else {
      console.log("전화를 못 걸었어요 ㅠㅠ");
    }
  }, 1000);
  res.send("call");
});

app.post("/events", async (req, res) => {
  console.log(req.body);
  console.log(req.headers);
  res.send("events");
});

app.get(`/twilio${accountSid}/Cancel`, (req, res) => {
  console.log("전화 거는것을 취소할게요.");
  flag = false;
  res.send("cancel");
});

app.get("/twiml", (req, res) => {
  const twiml = new twilio.twiml.VoiceResponse();

  twiml.say(
    {
      voice: "woman",
      loop: 10,
      language: "ko-KR",
    },
    "하우스에 정전이 발생했습니다."
  );

  res.set("Content-Type", "text/xml");
  res.send(twiml.toString());
});

app.use((req, res, next) => {
  res.status(403).send();
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
