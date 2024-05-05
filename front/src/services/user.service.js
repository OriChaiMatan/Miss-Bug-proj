import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'http://localhost:3030/api/user/'
const STORAGE_KEY = 'userDB'

export const userService = {
    query,
    get,
    save,
    remove
}


async function query(filterBy = {}) {
    let { data: users } = await axios.get(BASE_URL, { params: filterBy })
    return users
}
async function get(userId) {
    const { data: user } = await axios.get(BASE_URL + userId)
    return user
}

async function remove(userId) {
    return axios.delete(BASE_URL + userId)
}

async function save(user) {
    const method = user._id ? 'put' : 'post'
    const { data: savedUser } = await axios[method](BASE_URL + (user._id || ''), user)
    return savedUser
}