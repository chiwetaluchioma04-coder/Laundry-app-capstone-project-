import React from 'react';

const WhatsAppButton = () => {
  // Replace this placeholder with your actual copied WhatsApp Group Invite Link
  const groupInviteUrl = "https://chat.whatsapp.com/HE9UcoaTmaEBIx9ljTdbCT?s=cl&p=i&mlu=0&ilr=4";

  return (
    <a
      href={groupInviteUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: '#25D366',
        color: '#fff',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
        zIndex: 9999, // Keeps it on top of all page elements
        transition: 'transform 0.2s ease-in-out',
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      aria-label="Join our WhatsApp Group"
    >
      {/* Official WhatsApp SVG Icon */}
      <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.004 2c-5.51 0-9.996 4.486-9.996 9.998 0 1.763.459 3.479 1.33 4.996L2 22l5.166-1.354c1.47.8 3.119 1.219 4.834 1.216h.004c5.51 0 9.996-4.486 9.996-9.998C22.004 6.486 17.514 2 12.004 2zm0 1.792c4.526 0 8.204 3.68 8.208 8.206 0 2.19-.573 4.321-1.656 6.196l-.363.578 1.077 3.932-4.019-1.055-.558.331a8.163 8.163 0 0 1-4.693 1.46c-4.528 0-8.208-3.68-8.213-8.208-.002-2.19.571-4.323 1.656-6.2l.363-.577-1.078-3.931 4.02 1.054.557-.331a8.16 8.16 0 0 1 4.691-1.459zM8.51 7.629c-.19-.422-.39-.43-.57-.438-.147-.006-.316-.006-.485-.006-.169 0-.443.063-.675.316-.232.253-.886.865-.886 2.11 0 1.245.907 2.448 1.033 2.617.127.17 1.785 2.726 4.323 3.822.604.261 1.074.417 1.442.534.607.193 1.158.165 1.594.1.485-.072 1.49-.608 1.701-1.194.21-.587.21-1.09.147-1.194-.063-.105-.232-.169-.485-.296-.253-.127-1.49-.735-1.722-.819-.232-.084-.401-.127-.57.127-.169.253-.654.819-.802.988-.147.17-.295.19-.548.063-.253-.127-1.07-.394-2.036-1.254-.752-.67-1.26-1.5-1.408-1.753-.147-.253-.016-.39.111-.516.114-.113.253-.296.38-.443.127-.147.169-.253.253-.422.084-.169.042-.317-.021-.443-.063-.127-.554-1.334-.764-1.838z"/>
      </svg>
    </a>
  );
};

export default WhatsAppButton;