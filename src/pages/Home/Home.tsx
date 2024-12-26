import React, { useEffect, useState } from "react";
import '../Home/Home.css'
import { useNavigate } from "react-router-dom";
import * as Constants from "../../constants/constants.tsx";

interface Notes{
    uuid:string,
    notes:string
}

function HomePage() {
    const navigate = useNavigate();
    const [notes, setNotes] = useState<Notes[]>([]);

    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        notes: ""
    });

    useEffect(() => {
        getNotesData(`${Constants.baseUrl}notes/list`);
      }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSignOut = () => {
        localStorage.removeItem("authToken");
        navigate('/signin')
    };

    const createNote = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!formData.notes) {
            alert("Add Notes data first");
            return;
        }

        const notesPayload = {
            notes:formData.notes
        }

        const result= await postNotesData(`${Constants.baseUrl}notes/create`,notesPayload);
        console.log(result.data);
        if (result && result.code==="201") {
            alert("Notes Added Successfully");
            setNotes(result.data);
        }else{
            alert("Failed to add the Notes");
        }
    }

    const deleteNote = async (note: string) => {

    }

    const updateNote = async (note: string) => {

    }

    async function deleteTodo(uuid:string) {        
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${Constants.baseUrl}notes/delete/${uuid}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
              },
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
      
            const result = await response.json();
            if (result && result.code==="200") {
                alert("Deleted Successfully")
            }
            
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setLoading(false);
          }
    }

    // get user notes list data
    const getNotesData = async (url: string): Promise<void> => {
        try {
          setLoading(true);
          setError(null);
          const token = localStorage.getItem("authToken");
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    
          const result = await response.json();
          if (result && result.code==="200") {
            setNotes(result.data);
          }
          
        } catch (err) {
          setError((err as Error).message);
        } finally {
          setLoading(false);
        }
      };
    

    //notes API Call
    const postNotesData = async (url: string, body: Record<string, any>): Promise<any> => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("authToken");

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result;
        } catch (err) {
            setError((err as Error).message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="home-container">
            <nav className="navbar">
                <h2 className="navbar-title">Dashboard</h2>
                <button className="signout-button" onClick={handleSignOut}>
                    Sign Out
                </button>
            </nav>

            <div className="content">
                <div className="welcome-card">
                    <h3>Welcome, Jonas Kahnwald!</h3>
                    <p>Email: xxxxxx@xxxx.com</p>
                </div>

                <div className="input-group">
                    <label htmlFor="notes">Add Notes</label>
                    <textarea name="notes" value={formData.notes}
                        onChange={handleChange} required
                        placeholder="Add your Notes" id="notes" rows={5} cols={50}></textarea>
                </div>

                <div className="btn-container">
                    <button className="create-note-button" onClick={createNote}>
                        Create Note
                    </button>

                </div>

            </div>

            <div className="notes-container">
                <h3>Notes</h3>
                <div className="notes-list">
                    {notes.map((note, index) => (
                        <div className="note-item" key={index}>
                            <span>{note.notes}</span>
                            <button
                                className="delete-button"
                                onClick={() => deleteTodo(note.uuid)}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    );
}

export default HomePage;

