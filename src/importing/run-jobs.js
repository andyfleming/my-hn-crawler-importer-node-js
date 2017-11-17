// Resolve a Promise in X ms
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))

// Get the current time in milliseconds
const now = () => (new Date).getTime()

// Settings for crawl-rate
const MAX_JOBS_PER_PERIOD = parseInt(process.env.MAX_JOBS_PER_PERIOD || 250)
const PERIOD_LENGTH_SECONDS = parseInt(process.env.PERIOD_LENGTH_SECONDS || 5)

module.exports = async function runJobs(jobs, work) {

    // Clone the array
    let remainingJobs = [...jobs]

    // We'll also create a function for adding a job
    const addJob = job => {
        remainingJobs.push(job)
    }

    // Create an array to store promises
    // We'll use this after all jobs have been started to ensure all are completed before we resolve as complete
    let jobPromises = []

    // We'll keep track of how many jobs have been started since we started this period
    let numJobsInCurrentPeriod = 0

    // We'll also keep track of our timeouts we set for decrementing the num of jobs started this period
    let decrementTimers = []

    return new Promise(async resolve => {
        
        // Run our working loop
        while (remainingJobs.length > 0) {

            // If we've hit our max number of jobs already, set a (non-blocking) timer to delay our execution 500ms
            // Then we'll restart our loop
            if (numJobsInCurrentPeriod >= MAX_JOBS_PER_PERIOD) {
                console.log('At max jobs allowed for this period. Sleeping 500ms...')
                await wait(500)
                continue
            }

            // Increment our jobs in this period since we are about to start another
            numJobsInCurrentPeriod++

            // Set a timer to decrement after it is our of range of the period length
            const clearDecrementTimer = setTimeout(() => {
                numJobsInCurrentPeriod--
            }, PERIOD_LENGTH_SECONDS * 1000)

            decrementTimers.push(clearDecrementTimer)

            // Grab the first job off the queue (and remove it from the queue)
            const job = remainingJobs.shift()

            // Call the provided work function and capture the promise it returns
            // We'll capture the promise that work() returns
            // We also pass it an "addJob" function to allow it to queue additional jobs, if needed
            console.log('Working next job')
            jobPromises.push(work(job, addJob))

        }

        // Wait to ensure all jobs have completed, then resolve
        Promise.all(jobPromises).then(() => {
            
            // Also, before we resolve, we want to clean up any outstanding timers we have
            decrementTimers.forEach(t => clearTimeout(t))
            
            resolve()
        })
    })
}
