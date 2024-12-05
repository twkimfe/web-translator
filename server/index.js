const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const translationRoutes = require("./routes/translationRoutes");

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어 설정
app.use(cors());
app.use(express.json());

// DB 연결
connectDB();

// 기본 라우트 - 서버 상태 확인용
app.get("/", (req, res) => {
  res.json({ message: "서버가 정상적으로 실행 중입니다." });
});

// 라우터 등록
app.use("/api/translations", translationRoutes);

// 에러 핸들링
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "서버 내부 오류가 발생했습니다.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
