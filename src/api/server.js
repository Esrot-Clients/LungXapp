import axios, { AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const defaultOptions = {
  baseURL: "https://lung.thedelvierypointe.com/",
  headers: {
    "Content-Type": "application/json",
  },
};
const refreshTokenEndpoint =
  "https://lung.thedelvierypointe.com/api/token/refresh/";

// const refreshAuthLogic = async (failedRequest: AxiosRequestConfig) => {
//     try {
//         const refresh_token = await AsyncStorage.getItem('@userrefreshtoken');
//         const response = await axios.post(refreshTokenEndpoint, {refresh: refresh_token});
//         const {access} = response.data;
//         await AsyncStorage.setItem('@useraccesstoken', access);
//         failedRequest.response.config.headers['Authorization'] = 'Bearer ' + access;
//         return Promise.resolve();
//     } catch (error) {
//         return Promise.reject(error);
//     }
// };

const refreshAuthLogic = async () => {
  try {
    const refresh_token = await AsyncStorage.getItem("userrefreshtoken");
    const response = await axios.post(refreshTokenEndpoint, {
      refresh: refresh_token,
    });
    const { access, refresh } = response.data;
    await AsyncStorage.setItem("useraccesstoken", access);
    await AsyncStorage.setItem("userrefreshtoken", refresh);
    return access;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

let LungXinstance = axios.create(defaultOptions);

LungXinstance.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};
    let accesstoken = await AsyncStorage.getItem("useraccesstoken");
    console.log("usertoken is:", accesstoken);
    config.headers.Authorization = accesstoken ? `Bearer ${accesstoken}` : "";
    return config;
  },
  (error) => Promise.reject(error)
);

LungXinstance.interceptors.response.use(
  (response) => {
    // console.log('response', response)
    return response;
  },
  async (error) => {
    console.log("Error Found", JSON.stringify(error.response, null, 2));
    const status = error?.response ? error.response.status : null;
    const originalRequest = error?.config;
    if (status === 401 && !originalRequest?._sent) {
      originalRequest._sent = true;
      try {
        const accesstoken = await refreshAuthLogic();
        originalRequest.headers.Authorization = `Bearer ${accesstoken}`;
        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default LungXinstance;
