// middleware/error.middleware.js
const errorHandler = (error, req, res, next) => {
  console.error("Error:", error);
  res.status(error.status || 500).json({
    error: error.message || "서버 에러가 발생했습니다.",
    status: "error",
  });
};

module.exports = errorHandler;
