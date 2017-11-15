const importStory = require('./import-story')
const importComment = require('./import-comment')

module.exports = function workJob(job, addJob) {
    switch (job.type) {
        case 'story':
            return importStory(job.data.id, true, addJob)
        case 'comment':
            return importComment(job.data.id)
        default:
            throw new Error('Invalid job type: ' + job.type)
    }
}
