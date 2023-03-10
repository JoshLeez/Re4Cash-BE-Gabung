const { query } = require("../config/query");

const artikelTbl = async () => {
  try {
    const checkTable = await query(`SHOW TABLES LIKE 'artikel'`);
    if (checkTable.length === 0) {
      await query(`
         CREATE TABLE artikel (
            id INT NOT NULL PRIMARY KEY UNIQUE AUTO_INCREMENT,
            judul_artikel VARCHAR(100) NOT NULL,
            kategori VARCHAR(100) NOT NULL,
            sub_kategori VARCHAR(100) NOT NULL,
            artikel TEXT NOT NULL,
            foto_artikel VARCHAR(255) DEFAULT NULL,
            tanggal_artikel DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            update_tanggal_artikel DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
            created_by BIGINT DEFAULT NULL,
            update_by BIGINT DEFAULT NULL
         );
         `);
    }
  } catch (error) {
    console.log("artikel tabel " + error);
  }
};

const getArtikel = async () => {
  try {
    const sql = await query(
      `SELECT id_artikel, judul_artikel, kategori, sub_kategori, artikel, foto_artikel from artikel`
    );

    return sql;
  } catch (error) {
    console.log("model" + error);
  }
};

module.exports = {
  artikelTbl,
  getArtikel,
};
