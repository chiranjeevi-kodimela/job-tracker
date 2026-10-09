import { useEffect, useState} from "react";
import { Link, useParams} from "react-router-dom";
import { getApplicationById } from "../services/api";

function ApplicationDetailsPage() {
    const {id} = useParams();
    const [application, setApplication] = useState(null);
    const[loading,setLoading] =useState(true);
    const[error,setError]=useState("");

    useEffect(()=> {
        const loadApplication = async () => {
            try {
                const data=await getApplicationById(id);
                setApplication(data.application);
            } catch (error) {
                setError(error.message || "Failed to load application.");
            } finally {
                setLoading(false);
            }
        };
        loadApplication();
    },[id]);
    if(loading) {
        return <p>Loading application details...</p>
    }
    if(error) {
        return <p>{error}</p>
    }
    if(!application) {
        return <p>Application not found.</p>
    }

    return(
        <div>
            <Link to="/applications">Back to Applications</Link>

            <h1>{application.job_title}</h1>

            <p>Company: {application.company_name}</p>
            <p>Status: {application.status}</p>
            <p>Application Date: {application.applied_date || "Not provided"}</p>
            <p>Job URL: {application.job_url || "Not provided"}</p>
            <p>Description: {application.job_description || "Not provided"}</p>
            <p>note: {application.notes || "Not provided"}</p>
            <p>Created At: {application.created_at || "Not available"}</p>
        </div>
    );

}

export default ApplicationDetailsPage;