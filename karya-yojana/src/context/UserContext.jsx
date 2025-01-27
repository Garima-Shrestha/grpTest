import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        // Fetch user ID from an API or local storage
        const fetchUserId = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/get-user-id'); // Adjust the endpoint as needed
                setUserId(response.data.userId);
            } catch (error) {
                console.error('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    return (
        <UserContext.Provider value={{ userId }}>
            {children}
        </UserContext.Provider>
    );
};
