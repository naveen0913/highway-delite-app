import React, { useState } from "react";
import '../Home/Home.css'
import { useNavigate } from "react-router-dom";

function HomePage() {
    const navigate = useNavigate(); // For 
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const notes = ["Note 1", "Note 2"]; // Example 
    const [formData, setFormData] = useState({
        notes: ""
    });

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
            alert("Add data first");
            return;
        }
    }

    const deleteNote = async (note: string) => {

    }

    const updateNote = async (note: string) => {

    }



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
                        onChange={handleChange}
                        placeholder="Your Name" id="notes" rows={5} cols={50}></textarea>
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
                            <span>{note}</span>
                            <button onClick={() => updateNote(note)}>
                                Update
                            </button>
                            <button
                                className="delete-button"
                                onClick={() => deleteNote(note)}
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

