const { default: Axios } = require("axios");

const URL = "http://127.0.0.1:8000";

const getDataWithPost = (path,data) => {
  return Axios.post(URL + path,data);
};
const saveData = (path, data) => {
  return Axios.post(URL + path, data);
};
const updateData = (path, id, data) => {
  return Axios.put(`${URL}${path}/${id}`, data);
};
const filterData = (path, data) => {
  return Axios.post(URL + path, data);
};
export { getDataWithPost, saveData, updateData, filterData ,URL};
