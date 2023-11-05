/**
 * Email Verification component
 */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { verifyEmail } from '../../services/userAPI';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

const EmailVerification = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailToken = searchParams.get('emailToken');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');

  useEffect(() => {
    verifyEmail(emailToken)
      .then((result) => {
        setVerificationMessage(result.message);
        setVerificationStatus(result.status); 
      })
      .catch((error) => {
        console.error('Email verification error:', error);
        setVerificationMessage('Email verification failed. Please try again.');
        setVerificationStatus('');
      });
  }, [emailToken]);

  return (
    <section className="main-section" id="email-verification">
      <div id="email-verification-container">
        <h3>Email Verification</h3>
        <p>{verificationMessage}</p>
        {verificationStatus === 'Verified' && (
          <Link to="/login">
            <Button 
              variant="contained" 
              color="primary"
              style={{ marginTop: '20px' }}  
            >
              Go to Login
            </Button>
          </Link>
        )}
      </div>
    </section>
  );
};

export default EmailVerification;

