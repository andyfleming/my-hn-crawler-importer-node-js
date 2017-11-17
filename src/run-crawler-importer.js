const createDbConnection = require('./db/create-connection')
const createTables = require('./db/create-tables')
const importTopStories = require('./importing/import-top-stories')

process.on('unhandledRejection', (err, p) => { throw err })

async function main() {

    const dbConn = await createDbConnection()

    await createTables(dbConn)
    await importTopStories(dbConn)
    await dbConn.end()

    console.log('Importing complete.')
}

main()
