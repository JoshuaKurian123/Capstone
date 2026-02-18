const AuditLog = require("../models/AuditLog");

exports.getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = forwarded
    ? forwarded.split(",")[0].trim()
    : req.socket.remoteAddress;
  if (ip && ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }
  return ip;
};

exports.createAuditLog = async (log) => {
  await AuditLog.create(log);
};
