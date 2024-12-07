// middleware/error.middleware.js
const mongoose = require("mongoose");

// 커스텀 에러 클래스
class AppError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
    this.timestamp = new Date().toISOString();
  }
}

// 에러 타입별 처리 함수
const handleMongoDBDuplicateKey = (error) => {
  const field = Object.keys(error.keyPattern)[0];
  return new AppError(`${field} 값이 이미 존재합니다.`, 400);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map((err) => err.message);
  return new AppError(`입력값 검증 실패: ${errors.join(", ")}`, 400);
};

const handleCastError = (error) => {
  return new AppError(`잘못된 ${error.path} 형식: ${error.value}`, 400);
};

// 메인 에러 핸들러
const errorHandler = (error, req, res, next) => {
  console.error("Error Stack:", error.stack);

  // 기본 에러 정보
  let customError = {
    status: error.status || 500,
    message: error.message || "서버 에러가 발생했습니다.",
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // 개발 환경에서만 스택 트레이스 포함
  if (process.env.NODE_ENV === "development") {
    customError.stack = error.stack;
  }

  // MongoDB 관련 에러 처리
  if (error.code === 11000) {
    const duplicateError = handleMongoDBDuplicateKey(error);
    customError.status = duplicateError.status;
    customError.message = duplicateError.message;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    const validationError = handleValidationError(error);
    customError.status = validationError.status;
    customError.message = validationError.message;
  }

  if (error instanceof mongoose.Error.CastError) {
    const castError = handleCastError(error);
    customError.status = castError.status;
    customError.message = castError.message;
  }

  // 운영 환경에서는 500 에러의 실제 메시지를 숨김
  if (process.env.NODE_ENV === "production" && customError.status === 500) {
    customError.message = "서버 에러가 발생했습니다.";
  }

  // 요청 정보 로깅
  console.error("Error Details:", {
    timestamp: customError.timestamp,
    path: customError.path,
    method: customError.method,
    status: customError.status,
    message: customError.message,
  });

  res.status(customError.status).json({
    success: false,
    error: customError,
  });
};

// 404 에러 핸들러
const notFoundHandler = (req, res, next) => {
  next(new AppError(`${req.originalUrl} 경로를 찾을 수 없습니다.`, 404));
};

// 비동기 에러 래퍼
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  errorHandler,
  notFoundHandler,
  asyncHandler,
  AppError,
};
