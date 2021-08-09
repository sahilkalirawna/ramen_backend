const Profile = require("../models/Profile");
const Cofounder = require("../models/Cofounder");

const { sendEmail } = require("../helper/index");

exports.sendMail = async (req, res) => {
  const userid = req.userId;
  const sendId = req.params.sendId;
  const sender = await Profile.findById(userid).select("-_id email");
  console.log(sender.email.replace("gmail.com", "noreply.com"));
  const receiver = await Profile.findById(sendId).select("-_id email");

  const emailData = {
    from: sender.email,
    to: receiver.email,
    subject: "Interested for Cofounder",
    text: `I am Interested`,
    html: `<p>I am Interested</p>`,
  };

  const result = await sendEmail(emailData);

  return res.status(200).json({
    message: `Email has been sent to ${receiver.email}..`,
  });
};

exports.cofounderActive = async (req, res) => {
  const id = req.params.id;
  const cofounderId = await Profile.findById(id);
  cofounderId.lookingforfounder = true;
  await cofounderId.save();
  const find = await Cofounder.findById(cofounderId.cofounder);
  console.log(find);
  find.Timecommit = req.body.Timecommit;
  find.preference = req.body.preference;
  find.preferedcustomer = req.body.copreference;
  const result = await find.save();

  const aggregatePipeline = [{}];
  Cofounder.aggregate(aggregatePipeline);

  res.status(200).json({
    message: "Profile Activated for Cofounder finding ...",
    success: true,
    result,
  });
};
