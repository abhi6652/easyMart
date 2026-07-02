import React from 'react';

const About = () => {
  const containerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '40px',
    background: '#18181b',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    textAlign: 'center'
  };

  const socialBtnStyle = {
    display: 'inline-block',
    margin: '10px',
    padding: '10px 20px',
    background: '#27272a',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(255, 255, 255, 0.1)'
  };

  return (
    <div style={containerStyle}>
     
      <h2 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#fff',  }}>About Us</h2>
      

      <p style={{ color: '#a1a1aa', fontSize: '1.2rem', lineHeight: '1.8', maxWidth: '600px', margin: '0 auto 30px auto' }}>
      <strong>Welcome to easyMart, a modern e-commerce platform designed to provide a fast, secure, and seamless online shopping experience.
This website is a collaborative MERN Stack project developed by Abhijeet Kumar Sharma, Amit Mahato, and Falguni Ghosh, B.Tech 2nd Year students at Netaji Subhas University. Built using MongoDB, Express.js, React.js, and Node.js, easyMart reflects our passion for full-stack web development and creating responsive, user-friendly web applications.<br></br>
"Shop Smart. Shop Easy. Shop with easyMart".</strong>
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
        
      </div>
    </div>
  );
};

export default About;
