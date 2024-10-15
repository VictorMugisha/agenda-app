export function getAuthToken() {
  return localStorage.getItem("agenda_token");
}

export function getProductionSocketURL() {
  return "https://victor-agenda-app.onrender.com";
}

export function getDevelopmentSocketURL() {
  return "http://localhost:8000";
}
