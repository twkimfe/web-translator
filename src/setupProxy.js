// src/setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:3001",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api", // URL에서 '/api'를 유지
      },
      onError: (err, req, res) => {
        console.error("Proxy Error:", err);
        res.status(500).json({
          success: false,
          message: "서버 연결에 실패했습니다.",
        });
      },
    })
  );
};
