const api = require('../crawling/api')

module.exports = async function importComment(conn, addJob, id) {
    console.log('Importing comment id: ' + id)
    const comment = (await api.get(`/item/${id}.json`)).data

    if (comment.kids && comment.kids.length > 0) {
        comment.kids.forEach(childId => {
            addJob({type: 'import-comment', data: {id: childId}})
        })
    }
}
