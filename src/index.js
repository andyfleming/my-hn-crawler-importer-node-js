const createConnection = require('./db/create-connection')
const createTables = require('./db/create-tables')
const importTopStories = require('./importing/import-top-stories')

process.on('unhandledRejection', (err, p) => { throw err })

async function main() {

    // Connect to the database
    const conn = await createConnection()

    // Create the tables if necessary
    await createTables(conn)

    // Default mode: Import Top Stories
    // TODO: consider a switch based on cli flags or similar
    await importTopStories(conn)

    // Close the connection
    conn.end()

}

main()
