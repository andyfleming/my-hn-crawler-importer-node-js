const axios = require('axios')
const hnApiBaseUrl = process.env.HN_API_BASE_URL || 'https://hacker-news.firebaseio.com/v0'

module.exports = {
    get: path => axios.get(hnApiBaseUrl + path)
}
