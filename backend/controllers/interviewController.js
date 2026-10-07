const db = require("../config/db");

const createInterview = async (req,res) => {
    try {
        const {
            application_id,
            interview_type,
            interview_date,
            interview_time,
            meeting_link,
            interviewer,
            notes,
        } = req.body;

        if( !application_id || !interview_type || !interview_date) {
            return res.status(400).json({
                message: "Application, interview type and date are required ",
            });
        }

        const [applications] = await db.query(
            ` select id from applications where id =? and user_id =?`,
            [application_id, req.user.userId]
        );

        if(applications.lemgth === 0) {
            return res.status(404).json({
                message: "Application not found",
            });
        }

        const [result] =await db.query(
            ` INSERT INTO interviews (
                user_id,
                application_id,
                interview_type,
                interview_date,
                interview_time,
                meeting_link,
                interviewer,
                notes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.user.userId,
                application_id,
                interview_type,
                interview_date,
                interview_time || null,
                meeting_link || null,
                interviewer || null,
                notes || null,
            ]
        );
        res.status(201).json({
            message: "Interview created successfully",
            interviewId: result.insertId,
        });
    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: "server error",
        });
    }
};

const getInterviews = async (req, res) => {
  try {
    const [interviews] = await db.query(
      `SELECT
         i.id,
         i.application_id,
         a.job_title,
         c.name AS company_name,
         i.interview_type,
         i.interview_date,
         i.interview_time,
         i.meeting_link,
         i.interviewer,
         i.notes,
         i.created_at,
         i.updated_at
       FROM interviews i
       INNER JOIN applications a
         ON i.application_id = a.id
       INNER JOIN companies c
         ON a.company_id = c.id
       WHERE i.user_id = ?
       ORDER BY i.interview_date ASC, i.interview_time ASC`,
      [req.user.userId]
    );

    res.json({
      interviews,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getInterviewById =async(req,res) => {
    try{
        const {id} = req.params;

        const [interviews] = await db.query(
        `SELECT
         i.id,
         i.application_id,
         a.job_title,
         c.name AS company_name,
         i.interview_type,
         i.interview_date,
         i.interview_time,
         i.meeting_link,
         i.interviewer,
         i.notes,
         i.created_at,
         i.updated_at
        FROM interviews i
        INNER JOIN applications a
         ON i.application_id = a.id
        INNER JOIN companies c
         ON a.company_id = c.id
        WHERE i.id = ? AND i.user_id = ?`,
        [id, req.user.userId]
        );

        if (interviews.length === 0) {
        return res.status(404).json({
            message: "Interview not found",
        });
        }

        res.json({
        interview: interviews[0],
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "server error",
        });
    }
};

const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      application_id,
      interview_type,
      interview_date,
      interview_time,
      meeting_link,
      interviewer,
      notes,
    } = req.body;

    if (!application_id || !interview_type || !interview_date) {
      return res.status(400).json({
        message: "Application, interview type and interview date are required",
      });
    }

    const [applications] = await db.query(
      `SELECT id
       FROM applications
       WHERE id = ? AND user_id = ?`,
      [application_id, req.user.userId]
    );

    if (applications.length === 0) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const [result] = await db.query(
      `UPDATE interviews
       SET
         application_id = ?,
         interview_type = ?,
         interview_date = ?,
         interview_time = ?,
         meeting_link = ?,
         interviewer = ?,
         notes = ?
       WHERE id = ? AND user_id = ?`,
      [
        application_id,
        interview_type,
        interview_date,
        interview_time || null,
        meeting_link || null,
        interviewer || null,
        notes || null,
        id,
        req.user.userId,
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.json({
      message: "Interview updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query(
      `DELETE FROM interviews
       WHERE id = ? AND user_id = ?`,
      [id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Interview not found",
      });
    }

    res.json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview,
};