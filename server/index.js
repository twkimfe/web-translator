// index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const translationRoutes = require("./routes/translationRoutes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();
const PORT = process.env.PORT || 3001;

// CORS 설정 개선
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 기본 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 요청 로깅 (개발 환경에서만)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });
}

// DB 연결
connectDB();

// 기본 라우트 - 서버 상태 확인용
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "서버가 정상적으로 실행 중입니다.",
    timestamp: new Date().toISOString(),
  });
});

// API 라우트 등록
app.use("/api", translationRoutes);

// 404 처리
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `${req.originalUrl} 경로를 찾을 수 없습니다.`,
    timestamp: new Date().toISOString(),
  });
});

// 글로벌 에러 핸들러
app.use(errorHandler);

// 서버 시작
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(
    `Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}`
  );
  console.log(`Environment: ${process.env.NODE_ENV}`);
});

// 우아한 종료 처리 개선
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

function gracefulShutdown() {
  console.log("종료 신호를 받았습니다...");
  server.close(() => {
    console.log("서버 연결을 종료합니다...");
    process.exit(0);
  });

  // 강제 종료 타임아웃 설정 (10초)
  setTimeout(() => {
    console.log("강제 종료합니다...");
    process.exit(1);
  }, 10000);
}
