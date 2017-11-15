const api = require('../crawling/api')

module.exports = async function importStory(id, importComments = true, addJob) {
    console.log('Importing story id: ' + id)
    const story = (await api.get(`/item/${id}.json`)).data
    
    console.log('Mock importing story: ' + story.title)

    // Simulate adding a single comment job
    addJob({type: 'comment', data: {id: 1}})

    // if (importComments) {
    //     if (story.data.kids.length > 0) {

    //     }
    // }
}
