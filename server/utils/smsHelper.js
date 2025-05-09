const twilio = require("twilio");
const { v4: uuidv4 } = require("uuid");
const OtpSession = require("../Models/OtpSession");

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtp = async (phone) => {
  const sessionId = uuidv4();

  // const verification = await client.verify.v2
  //   .services(process.env.TWILIO_SERVICE_SID)
  //   .verifications.create({ to: phone, channel: "sms" });

  await OtpSession.create({
    sessionId,
    phone,
  });

  // return { sessionId, sid: verification.sid };
  // temp auth
  return { sessionId };

};
const verifyOtp = async (sessionId, code, countryCode, phoneNumber) => {
  const session = await OtpSession.findOne({ sessionId: sessionId, phone: `${countryCode} ${phoneNumber}` });
  if (!session) throw new Error("Invalid or expired session.");

  if (session.attempts >= 5) {
    await session.deleteOne();
    throw new Error("Too many attempts.");
  }

  // const verification = await client.verify.v2
  //   .services(process.env.TWILIO_SERVICE_SID)
  //   .verificationChecks.create({ to: session.phone, code });


  // verification.status === "approved"
  // temp auth
  if (true) {
    await session.deleteOne();
    return true;
  } else {
    session.attempts += 1;
    await session.save();
    throw new Error("Invalid OTP.");
  }
};
module.exports = {sendOtp, verifyOtp};
