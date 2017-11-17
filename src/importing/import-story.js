const api = require('../crawling/api')

module.exports = async function importStory(conn, addJob, id) {
    console.log('Importing story id: ' + id)
    const story = (await api.get(`/item/${id}.json`)).data
    
    console.log('Mock importing story: ' + story.title)

    if (story.kids && story.kids.length > 0) {
        story.kids.forEach(childId => {
            addJob({type: 'import-comment', data: {id: childId}})
        })
    }
}
