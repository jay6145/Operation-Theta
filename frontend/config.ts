export const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://operation-theta.vercel.app"
    : "http://localhost:5050";