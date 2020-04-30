import { Response, Request } from "express";
import { TwilioClient } from "../utils";

let timeout: NodeJS.Timeout = null; // 10초이내의 정전은 무시하기 위해 타이머 사용

/**
 * GET /onBattery
 * 정전이 되어 배터리 사용이 시작 됨
 */
export const onBattery = (req: Request, res: Response) => {
  if (timeout !== null) {
    return res.json({ ok: false, msg: `예약된 전화 걸기가 존재합니다.` });
  }

  timeout = setTimeout(() => {
    console.log("전화 걸어요");
    // 10초동안 전원공급이 복구되지 않으면 전화걸기
    new TwilioClient().call(
      process.env.MY_PHONE_NUMBER,
      "하우스에 정전이 발생하였습니다."
    );
    timeout = null;
  }, 10000);

  res.json({ ok: true, msg: `10초뒤에 전화걸기를 예약하였습니다.` });
};

/**
 * GET /offBattery
 * 전원공급이 복구되어 배터리 사용이 끝남
 */
export const offBattery = (req: Request, res: Response) => {
  if (timeout === null) {
    return res.json({ ok: false, msg: `예약된 전화 걸기가 없습니다.` });
  }

  clearTimeout(timeout);
  timeout = null;

  console.log("취소 됨");
  res.json({ ok: true, msg: `예약된 전화 걸기를 취소하였습니다.` });
};
