const Claim = require("../models/Claim");
const Policy = require("../models/Policy");
const { getClientIp, createAuditLog } = require("../services/helperService");

exports.createClaim = async (req, res) => {
  try {
    const lastClaim = await Claim.findOne({})
      .sort({ claimNumber: -1 })
      .select("claimNumber");
    let nextClaimNumber = "C001";
    if (lastClaim && lastClaim.claimNumber) {
      const lastNumber = parseInt(lastClaim.claimNumber.replace("C", ""), 10);
      nextClaimNumber = `C${String(lastNumber + 1).padStart(3, "0")}`;
    }
    const policy = await Policy.findOne({
      policyNumber: req.body.policyId,
      status: "ACTIVE",
    });
    if (!policy) {
      return res.status(404).json({ error: "No active policy found" });
    }
    const claim = await Claim.create({
      ...req.body,
      claimNumber: nextClaimNumber,
      policyId: policy._id,
      handledBy: req.user._id,
      remarks: JSON.stringify([
        {
          createdAt: new Date(),
          message: "Claim submitted for review.",
        },
      ]),
    });
    await createAuditLog({
      entityType: "CLAIM",
      entityId: claim._id,
      action: "CREATE",
      newValue: claim,
      performedBy: req.user._id,
      ipAddress: await getClientIp(req),
    });
    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("policyId")
      .populate("handledBy", "username");
    res.json(claims);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClaim = async (req, res) => {
  try {
    const oldValue = await Claim.findById(req.params.id);
    if (!oldValue) {
      return res.status(404).json({ error: "Claim not found" });
    }
    let remarks = [];
    try {
      remarks = oldValue.remarks ? JSON.parse(oldValue.remarks) : [];
    } catch {
      remarks = [];
    }
    const policy = req.body.policyId
      ? await Policy.findOne({ policyNumber: req.body.policyId })
      : await Policy.findById(oldValue.policyId);
    if (!policy) {
      return res.status(400).json({ error: "Policy not found" });
    }
    const { status } = req.body;
    const statusMessages = {
      IN_REVIEW: "Claim updated and resubmitted for review.",
      APPROVED: "Claim approved.",
      REJECTED: "Claim rejected.",
      SETTLED: "Claim settled.",
    };
    if (statusMessages[status]) {
      remarks.push({
        createdAt: new Date(),
        message: statusMessages[status],
      });
    }
    const claim = await Claim.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        policyId: policy._id,
        remarks: JSON.stringify(remarks),
      },
      { new: true },
    );
    await createAuditLog({
      entityType: "CLAIM",
      entityId: claim._id,
      action: "UPDATE",
      oldValue,
      newValue: claim,
      performedBy: req.user._id,
      ipAddress: await getClientIp(req),
    });
    res.json(claim);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
