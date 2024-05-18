import axios from "axios";
import { dataURIToBlob } from "../helpers";
// import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: `http://localhost:8080`,
  headers: {},
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const postScreenshot = (imageBase64) => {
  const file = dataURIToBlob(imageBase64);
  const formData = new FormData();
  formData.append("image", file, "image.jpg");

  return instance.post(`/api/actor/names`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
