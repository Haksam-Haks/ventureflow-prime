"use client";

import axios, { AxiosResponse } from "axios";
// Dynamically set SERVER_URL based on the current URL
const getServerUrl = () => {
  return "http://localhost:8080/";
  // return "https://uat.nepserv.co.ug:7045/egret-test/";
};
export const SERVER_URL = getServerUrl();

// 🔹 Extract a useful error message from axios errors

// Handle 401 globally
function handle401(error: any) {
  if (error?.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}

// Always get token fresh
const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token
    ? {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
};

const getNoAuthHeaders = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
});

const getMultipartHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token
    ? {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        Accept: "application/json",
      };
};

export const apiService = () => {
  const sendPostToServer = async <T>(url: string, data: any): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axios.post(
        SERVER_URL + url,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };

  const sendPdfPostToServer = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        headers: getAuthHeaders(),
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };

  const sendPostToServerPromise = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };

  const sendPostToServerPdf = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        headers: getAuthHeaders(),
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };

  const sendGetToServer = async <T>(url: string): Promise<T> => {
    try {
      const response = await axios.get<T>(SERVER_URL + url, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };

  const sendPostToServerMult = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        headers: getMultipartHeaders(),
      });
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };

  const sendPostToServerMultWithoutToken = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        headers: { Accept: "application/json" },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sendPostToServerWithOutToken = async (url: string, data: any, p0?: { headers: { 'Content-Type': string; }; }) => {
    try {
      const headers = p0?.headers ? p0.headers : getNoAuthHeaders();
      const response = await axios.post(SERVER_URL + url, data, {
        headers,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sendPostToServerPdfWithoutToken = async (url: string, data: any) => {
    try {
      const response = await axios.post(SERVER_URL + url, data, {
        headers: getNoAuthHeaders(),
        responseType: "blob",
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const sendRequestToServer = async (
    controller: string,
    request: string,
    data: any
  ): Promise<AxiosResponse> => {
    try {
      const response: AxiosResponse = await axios.post(
        `${SERVER_URL}${controller}/${request}`,
        data,
        { headers: getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      handle401(error);
      throw error;
    }
  };

  return {
    sendPostToServer,
    sendGetToServer,
    sendPdfPostToServer,
    sendPostToServerWithOutToken,
    sendPostToServerPdfWithoutToken,
    sendPostToServerPromise,
    sendPostToServerMultWithoutToken,
    sendPostToServerMult,
    sendPostToServerPdf,
    sendRequestToServer,
  };
};

export default apiService;
