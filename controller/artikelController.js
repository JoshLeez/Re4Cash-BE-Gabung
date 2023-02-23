const artikelModel = require("../model/artikel");

const tampilArtikel = async (req, res) => {
  try {
    const artikel = await artikelModel.getArtikel();

    console.log(artikel);
    res.status(200).json({
      message: "Data artikel berhasil ditampilkan",
      data: artikel,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  tampilArtikel,
};
