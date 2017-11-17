const api = require('../crawling/api')

module.exports = async function importStory(conn, addJob, id) {
    console.log('Importing story id: ' + id)

    try {
        const story = (await api.get(`/item/${id}.json`)).data
        
        // Example Response:
        /*
        {
            "by": "dhouston",
            "descendants": 71,
            "id": 8863,
            "kids": [
                8952,
                8876
            ],
            "score": 111,
            "time": 1175714200,
            "title": "My YC app: Dropbox - Throw away your USB drive",
            "type": "story",
            "url": "http://www.getdropbox.com/u/2/screencast.html"
        }
        */

        if (!story || !story.id || !story.title || !story.score || !story.by || !story.time || !story.type) {
            throw new Error('missing expected keys for story id: ' + id + ' - value: ' + JSON.stringify(story))
        }

        const values = [
            story.id,
            story.title,            
            story.score,
            story.by,
            story.time,
            story.type,
            story.url || ''
        ]

        await conn.execute("INSERT IGNORE INTO stories (hn_id, title, score, username, time, type, url) VALUES (?, ?, ?, ?, FROM_UNIXTIME(?), ?, ?)", values)

        if (story.kids && story.kids.length > 0) {
            //console.log('adding ' + story.kids.length + ' child comment jobs')            
            story.kids.forEach(childId => {
                addJob({type: 'import-comment', data: {id: childId}})
            })
        }

    } catch (err) {
        console.log('Error importing story')
        console.log(err)
        if (typeof story === typeof {}) {
            console.log('story data from API response: ' + JSON.stringify(story))
        }
    }
}
