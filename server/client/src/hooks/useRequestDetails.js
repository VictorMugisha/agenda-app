import { getAuthToken } from "../utils/utils";

export default function useRequestDetails() {
  async function getRequestStatus(requestId) {
    try {
      const response = await fetch(`/api/request/${requestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      console.log("Received response: ", response);
    } catch (error) {
      console.log("Something went wrong while getting request status: ", error);
      return;
    }
  }
  return { getRequestStatus };
}
