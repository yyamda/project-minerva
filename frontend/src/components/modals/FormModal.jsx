"use client";

import { useState } from "react";

export default function FormModa({ isOpen, onClose} ) {
    const [formData, setFormData] = useState({
        name: "",
        email: ""
    }); 

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted: ", formData);
        onClose();
    };
    return (
        <div>
        <h2> Pop up Form</h2>
        <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      </div>
    )
}