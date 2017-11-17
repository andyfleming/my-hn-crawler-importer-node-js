module.exports = async function createDb(conn) {
   
    await conn.query(`CREATE TABLE IF NOT EXISTS stories (
        id int(11) unsigned NOT NULL AUTO_INCREMENT,
        hn_id int(11) DEFAULT NULL,
        title text,
        score int(11) DEFAULT NULL,
        username varchar(255) DEFAULT NULL,
        time timestamp NULL DEFAULT NULL,
        type varchar(100) DEFAULT NULL,
        url text,
        PRIMARY KEY (id),
        UNIQUE KEY hn_id (hn_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

      await conn.query(`CREATE TABLE IF NOT EXISTS comments (
        id int(11) unsigned NOT NULL AUTO_INCREMENT,
        hn_id int(11) DEFAULT NULL,
        parent_hn_id int(11) DEFAULT NULL,
        text text,
        username varchar(255) DEFAULT NULL,
        time timestamp NULL DEFAULT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY hn_id (hn_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`)

}
