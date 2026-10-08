const db = require("../config/db");

const createCompany = async (req, res) => {
  try {
    const { name, website, location } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "company name is required",
      });
    }

    const [result] = await db.query(
      `insert into companies (user_id, name, website, location) values (?,?,?,?)`,
      [req.user.userId, name, website || null, location || null],
    );

    res.status(201).json({
      message: "Company created successfully",
      companyId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "server error",
    });
  }
};

const getCompanies = async (req, res) => {
  try {
    const [companies] = await db.query(
      `select id, name, website, location, created_at from companies where user_id = ?
            order by created_at desc`,
      [req.user.userId],
    );

    res.json({
      companies,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "server error",
    });
  }
};

const getCompniesById = async (req, res) => {
  try {
    const { id } = req.params;

    const [companies] = await db.query(
      `select id, name, website, location, created_at from companies where id = ? and user_id= ?`,
      [id, req.user.userId],
    );

    if (companies.length === 0) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    res.json({
      company: companies[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "server error",
    });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, location } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Comapny name is required",
      });
    }

    const [result] = await db.query(
      `update companies set name =?, website= ?, location=? where id =? and user_id=?`,
      [name, website || null, location || null, id, req.user.userId],
    );

    if (result.lenth === 0) {
      return req.status(404).json({
        message: "company not found",
      });
    }
    res.json({
      message: "company updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "server error",
    });
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `delete from companies where id=? and user_id = ?`,
      [id, req.user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "company not found",
      });
    }

    res.json({
      message: "company deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "server error",
    });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompniesById,
  updateCompany,
  deleteCompany,
};
