import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

// TODO Update API Link
// const BASE_URL = "http://localhost:5000/api";
const BASE_URL = "/api";
// const TOKEN =
// "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1NjQ5YWEwNjdlODVmZWUwMjA0ZmEwZCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTcwMTg3NTU2OCwiZXhwIjoxNzAyMTM0NzY4fQ.CQquYbzSRFp5G56oaEl6a9YMg2zTjUdMFUWph5adTRp4IKCI1wqrfJ-P0HkWkcIvy9rxhRPvktPkTjaH1bmBmcCQ_isYpuXeHN0jtEAXwQPJD1mNDvQRo-rXzr9ag4mMqqc_XNW4JR7nP9IBwDN5sgI_gC37SoIfRofmb2aJFdepSVv1QHafH01w0cX0aWu8JO9n0SRXxEDW1bnBXJAeCwlhSZCo7_-mKfMDOLHa3jsP0Bws4Jy9mekLJFoS0pebwe7RtgovdNhNPhLSPm_ZfwFZjHzzI4Xu1EYtS3B2kn-amG9FRfpiLHL6f0mAh_QZAEm6GAS1xMuH4oaNqDQcwQ";

export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  // headers: { Authorization: `Bearer ${TOKEN}` },
});

const UserRequestResponseInterceptor = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    userRequest.interceptors.request.use(
      (config) => {
        const token = currentUser ? currentUser.token : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      // userRequest.interceptors.request.eject(requestInterceptor);
    };
  }, [currentUser, dispatch]);

  return null; // This component doesn't render anything
};

export default UserRequestResponseInterceptor;
