export const BACKEND_URL = "http://localhost:8000";
export const CLOUD_NAME = "victormugisha";
export const UPLOAD_PRESET = "agenda_app";
export const ENVIRONMENT = import.meta.env.MODE === "development" ? "development" : "production";
console.log("The current working environment: ", ENVIRONMENT);

