const api = require('../crawling/api')
const importStory = require('./import-story')
const runJobs = require('./run-jobs')
const workJob = require('./work-job')

module.exports = async function importTopStories(conn) {
    const topStories = await api.get(`/topstories.json`)
    const topStoryIds = topStories.data

    console.log('topStoryIds', topStoryIds)

    const firstIds = topStoryIds.slice(0,5)
    
    // Format the jobs
    const jobs = firstIds.map(id => {
        return {
            type: 'import-story',
            data: {
                id: id
            }
        }
    })
    
    // Run jobs
    await runJobs(jobs, workJob(conn))

}
