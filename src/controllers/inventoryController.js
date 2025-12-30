const inventoryService = require("../services/inventoryService.js");

exports.getNumbers = async (req, res) => {
  try {
    const data = await inventoryService.getAllNumbers();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createNumber = async (req, res) => {
  try {
    const number = await inventoryService.addNumber(req.body);
    res.status(201).json(number);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateNumber = async (req, res) => {
  try {
    const updated = await inventoryService.updateNumber(
      req.params.id,
      req.body
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteNumber = async (req, res) => {
  try {
    await inventoryService.deleteNumber(req.params.id);
    res.json({ message: "Number deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
