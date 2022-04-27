export const BASE_URL =
  process.env.VUE_APP_API_BASE_URL || "http://localhost:3000";
export const SOCKET_URL =
  process.env.VUE_APP_SOCKET_URL || "ws://localhost:3000";

console.log(process.env.VUE_APP_API_BASE_URL);
