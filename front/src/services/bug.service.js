import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

const BASE_URL = 'http://localhost:3030/api/bug/'
const STORAGE_KEY = 'bugDB'

export const bugService = {
    query,
    get,
    save,
    remove,
    getDefaultFilter
}


async function query(filterBy = {}) {
    let { data: bugs } = await axios.get(BASE_URL, { params: filterBy })
    return bugs
}
async function get(bugId) {
    const { data: bug } = await axios.get(BASE_URL + bugId)
    return bug
}

async function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

async function save(bug) {
    const method = bug._id ? 'put' : 'post'
    // const queryParams = `?_id=${bug._id || ''}&title=${bug.title}&severity=${bug.severity}&description=${bug.description || ''}&createdAt=${bug.createdAt || ''}`
    // const { data: savedBug } = await axios.get(BASE_URL + 'save' + queryParams)
    const { data: savedBug } = await axios[method](BASE_URL + (bug._id || ''), bug)
    return savedBug
}

function getDefaultFilter() {
    return { title: '', severity: '', label: '', sortBy: '' }
}