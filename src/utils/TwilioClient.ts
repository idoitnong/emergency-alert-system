import twilio from "twilio";

export default class TwilioClient {
  private readonly accountSid = process.env.ACCOUNT_SID || "YOUR_ACCOUNT_SID";
  private readonly authToken = process.env.AUTH_TOKEN || "YOUT_AUTH_TOKEN";

  private client = twilio(this.accountSid, this.authToken);

  async call(to: string, body: string, loop: number = 10) {
    let res = null;

    console.log(to);
    try {
      res = await this.client.calls.create({
        twiml: `<Response><Say voice="woman" loop="${loop}" language="ko-KR">${body}</Say></Response>`,
        to,
        from: process.env.TWILIO_PHONE_NUMBER,
      });
    } catch (e) {
      console.error(res);
    }

    console.log(res.sid);
  }
}
