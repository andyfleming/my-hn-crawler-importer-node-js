module.exports = async function createDb(conn) {
   
    const [rows, fields] = await conn.query('SELECT 1')

    console.log(rows)
}
