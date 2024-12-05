// models/Translation.js
const mongoose = require("mongoose");

const translationSchema = new mongoose.Schema(
  {
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
      default: "ko",
    },
    targetLang: {
      type: String,
      default: "zh",
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Translation", translationSchema);
