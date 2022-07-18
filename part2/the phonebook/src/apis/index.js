import axios from 'axios';
const baseUrl = 'http://localhost:3001/persons';

export const getAll = () => {
  return axios.get(baseUrl)
}

export const create = newObject => {
  return axios.post(baseUrl, newObject)
}

export const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export const remove = id => {
  return axios.delete(`${baseUrl}/${id}`)
}