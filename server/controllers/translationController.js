// controllers/translation.controller.js
const Translation = require("../models/translation.model");

const translationController = {
  getTranslations: async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const [total, translations] = await Promise.all([
      Translation.countDocuments(),
      Translation.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    ]);

    res.json({
      translations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
      },
    });
  },
  // ... 다른 컨트롤러 메서드들
};

module.exports = translationController;
