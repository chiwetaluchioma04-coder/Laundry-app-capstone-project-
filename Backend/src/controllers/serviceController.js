const LaundryService = require("../models/LaundryService");
const { success, error } = require("../utils/apiResponse");

const listServices = async (req, res, next) => {
  try { return success(res, { services: await LaundryService.find({ active: true }) }); } catch (err) { return next(err); }
};

const createService = async (req, res, next) => {
  try { return success(res, { service: await LaundryService.create(req.body) }, "Service created", 201); } catch (err) { return next(err); }
};

const updateService = async (req, res, next) => {
  try {
    const service = await LaundryService.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!service) return error(res, "Service not found", 404);
    return success(res, { service }, "Service updated");
  } catch (err) { return next(err); }
};

module.exports = { listServices, createService, updateService };