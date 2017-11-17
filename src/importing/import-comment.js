const api = require('../crawling/api')

module.exports = async function importComment(conn, addJob, id) {
    console.log('Importing comment id: ' + id)

    try {
        const comment = (await api.get(`/item/${id}.json`)).data

        // If the comment is deleted, don't continue
        if (comment.deleted) {
            return
        }

        if (!comment || !comment.id || !comment.parent || !comment.text || !comment.by || !comment.time) {
            throw new Error('missing expected keys for comment id: ' + id)
        }

        const values = [
            comment.id,
            comment.parent,
            comment.text,
            comment.by,
            comment.time
        ]

        await conn.execute("INSERT IGNORE INTO comments (hn_id, parent_hn_id, text, username, time) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?))", values)

        if (comment.kids && comment.kids.length > 0) {
            comment.kids.forEach(childId => {
                addJob({type: 'import-comment', data: {id: childId}})
            })
        }
    } catch (err) {
        console.log('Error importing comment')
        console.log(err)
        if (typeof comment === typeof {}) {
            console.log('comment data from API response: ' + JSON.stringify(comment))
        }
    }

}
