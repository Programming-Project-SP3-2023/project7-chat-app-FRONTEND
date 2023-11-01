// EmailVerification.js

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { verifyEmail } from '../../services/userAPI'; // Import the verifyEmail function

const EmailVerification = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const emailToken = searchParams.get('emailToken');
  const [verificationResult, setVerificationResult] = useState('');

  useEffect(() => {
    // Use the verifyEmail function to verify the email token
    verifyEmail(emailToken)
      .then((result) => {
        setVerificationResult(result);
      })
      .catch((error) => {
        console.error('Email verification error:', error);
        setVerificationResult('Email verification failed. Please try again.');
      });
  }, [emailToken]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{verificationResult}</p>
    </div>
  );
};

export default EmailVerification;
