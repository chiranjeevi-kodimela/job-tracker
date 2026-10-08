const db = require("../config/db");

const createApplication = async (req, res) => {
  try {
    const {
      company_id,
      job_title,
      job_url,
      status,
      applied_date,
      job_description,
      notes,
    } = req.body;

    if (!company_id || !job_title) {
      return res.status(400).json({
        message: "company and job title are required",
      });
    }

    const [companies] = await db.query(
      ` select id from companies where id =? and user_id =?`,
      [company_id, req.user.userId],
    );

    if (companies.length === 0) {
      return res.status(404).json({
        message: "comapny not found",
      });
    }

    const [result] = await db.query(
      `insert into applications(
                user_id,
                company_id,
                job_title,
                job_url,
                status,
                applied_date,
                job_description,
                notes
                ) values (?,?,?,?,?,?,?,?)`,
      [
        req.user.userId,
        company_id,
        job_title,
        job_url || null,
        status || "applied",
        applied_date || null,
        job_description || null,
        notes || null,
      ],
    );

    res.status(201).json({
      message: "application created successfully",
      applicationId: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "server error",
    });
  }
};

const getApplications = async (req, res) => {
  try {
    const [applications] = await db.query(
      `select
            a.id,
            a.company_id,
            c.name as company_name,
            a.job_title,
            a.job_url,
            a.status,
            a.applied_date,
            a.job_description,
            a.notes,
            a.created_at,
            a.updated_at 
            from applications a 
            inner join companies c
                on a.company_id = c.id
            where a.user_id = ?
            order by a.created_at desc`,
      [req.user.userId],
    );

    res.json({
      applications,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "server error",
    });
  }
};

const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;
    const [applications] = await db.query(
      `SELECT
         a.id,
         a.company_id,
         c.name AS company_name,
         a.job_title,
         a.job_url,
         a.status,
         a.applied_date,
         a.job_description,
         a.notes,
         a.created_at,
         a.updated_at
        FROM applications a
        INNER JOIN companies c
         ON a.company_id = c.id
        WHERE a.id = ? AND a.user_id = ?`,
      [id, req.user.userId],
    );

    if (applications.length === 0) {
      return res.status(404).json({
        message: "application not found",
      });
    }

    res.json({
      applications: applications[0],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "server error",
    });
  }
};

const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      company_id,
      job_title,
      job_url,
      status,
      applied_date,
      job_description,
      notes,
    } = req.body;

    if (!company_id || !job_title) {
      return res.status(400).json({
        message: "Company and job title are required",
      });
    }

    const [companies] = await db.query(
      `SELECT id
       FROM companies
       WHERE id = ? AND user_id = ?`,
      [company_id, req.user.userId],
    );

    if (companies.length === 0) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const [result] = await db.query(
      `UPDATE applications
       SET
         company_id = ?,
         job_title = ?,
         job_url = ?,
         status = ?,
         applied_date = ?,
         job_description = ?,
         notes = ?
       WHERE id = ? AND user_id = ?`,
      [
        company_id,
        job_title,
        job_url || null,
        status || "Applied",
        applied_date || null,
        job_description || null,
        notes || null,
        id,
        req.user.userId,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Application updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `DELETE FROM applications
       WHERE id = ? AND user_id = ?`,
      [id, req.user.userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
