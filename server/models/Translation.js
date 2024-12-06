// models/Translation.js
const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema({
  sourceText: {
    type: String,
    required: true,
  },
  translatedText: {
    type: String,
    required: true,
  },
  sourceLang: {
    type: String,
    required: true,
    default: "ko",
  },
  targetLang: {
    type: String,
    required: true,
    default: "zh",
  },
  matchScore: {
    type: Number,
    min: 0,
    max: 1,
    default: null,
  },
  qualityScore: {
    type: Number,
    min: 0,
    max: 1,
    default: null,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Translation", translationSchema);
