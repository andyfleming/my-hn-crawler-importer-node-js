// Resolve a Promise in X ms
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

// Get the current time in milliseconds
const now = () => (new Date).getTime()

// Settings for crawl-rate
const MAX_JOBS_PER_PERIOD = parseInt(process.env.MAX_JOBS_PER_PERIOD || 100)
const PERIOD_LENGTH_SECONDS = parseInt(process.env.PERIOD_LENGTH_SECONDS || 10)

module.exports = async function runJobs(jobs, work) {

    // Clone the array
    let remainingJobs = [...jobs]
    
    // Create an array to store promises
    // We'll use this after all jobs have been started to ensure all are completed before we resolve as complete
    let jobPromises = []

    // We'll also create a function for adding a job
    const addJob = job => { remainingJobs.push(job) }

    // We'll keep track of how many jobs have been started since we started this period
    let startOfPeriod = now()
    let numJobsInPeriod = 0

    return new Promise(async resolve => {
        
        // Run our working loop
        while (remainingJobs.length > 0) {
        
            // Reset our job count and timer if we are in a new period
            if (now() - startOfPeriod > PERIOD_LENGTH_SECONDS * 1000) {
                startOfPeriod = now()
                numJobsInPeriod = 0
            }

            // If we've hit our max number of jobs already, set a (non-blocking) timer to delay our execution until the period is over
            if (numJobsInPeriod === MAX_JOBS_PER_PERIOD) {
                
                // Calculate the end of this period. We'll "wait" until the end of the period to continue
                const endOfPeriod = startOfPeriod + (PERIOD_LENGTH_SECONDS * 1000)
                const msUntilEndOfPeriod = Math.max(endOfPeriod - now() ,0)

                console.log('Hit max of ' + MAX_JOBS_PER_PERIOD + ' per ' + PERIOD_LENGTH_SECONDS + ' seconds. Waiting ' + msUntilEndOfPeriod + ' milliseconds before continuing.')

                await wait(msUntilEndOfPeriod)
            }

            // Increment our jobs in this period since we are about to start another
            numJobsInPeriod++

            // Grab the first job off the queue (and remove it from the queue)
            const job = remainingJobs.shift()

            // Call the provided work function and capture the promise it returns
            // We'll capture the promise that work() returns
            // We also pass it an "addJob" function to allow it to queue additional jobs, if needed
            console.log('Working next job')
            jobPromises.push(work(job, addJob))

        }

        // Wait to ensure all jobs have completed, then resolve
        Promise.all(jobPromises).then(resolve)
    })
}
