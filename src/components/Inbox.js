import React, { useState } from 'react';
import './Inbox.css'; // Import CSS file for sidebar styles

const Inbox = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    // Fetch notifications when the sidebar is opened
    if (!showSidebar) {
      fetchNotifications();
    }
  };

  const fetchNotifications = async () => {
    // try {
    //   // Fetch notifications from backend
    //   const response = await fetch('backend_endpoint_for_notifications');
    //   const data = await response.json();
    //   setNotifications(data);
    // } catch (error) {
    //   console.error('Error fetching notifications:', error);
    // }
  };

  return (
    <div>
    <div className={`inbox-container ${showSidebar ? 'sidebar-open' : ''}`}>
      {!showSidebar && <button class='sidebar-toggle-btn' onClick={toggleSidebar}>N</button>}
      <div className={`sidebar ${showSidebar ? 'show' : 'hide'}`}>
        <div style={{backgroundColor:'teal',display:'flex',flexDirection:'row',justifyContent:'space-between',margin:'0', padding:'5%'}}>
        <h2 style={{color:'white',backgroundColor:'teal',margin:'0', padding:'5%'}}>Notifications</h2>
        <button onClick={()=>{setShowSidebar(false)}} style={{backgroundColor:'white',color:'black',height:'50px'}}>Close</button>

        </div>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>{notification}</li>
          ))}
        </ul>
      </div>
      </div>
    </div>
  );
};

export default Inbox;
