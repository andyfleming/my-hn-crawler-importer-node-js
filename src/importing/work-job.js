const importStory = require('./import-story')
const importComment = require('./import-comment')

module.exports = (conn) => {
    return function workJob(job, addJob) {
        switch (job.type) {
            case 'import-story':
                return importStory(conn, addJob, job.data.id)
            case 'import-comment':
                return importComment(conn, addJob, job.data.id)
            default:
                throw new Error('Invalid job type: ' + job.type)
        }
    }
}
