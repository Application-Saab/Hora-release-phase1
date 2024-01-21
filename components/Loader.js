import React, { useState, useEffect } from 'react';
import Spinner from 'react-native-loading-spinner-overlay';

const Loader = ({ loading }) => {
  const [loadingText, setLoadingText] = useState('Data is loading...');

  useEffect(() => {
    let timeout;

    if (loading) {
      // Show "Data is loading..." initially
      setLoadingText('Data is loading...');

      // After 3 seconds, update the text to "Please wait..."
      timeout = setTimeout(() => {
        setLoadingText('Please wait...');
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [loading]);

  return (
    <Spinner
      visible={loading}
      textContent={loadingText}
      textStyle={{ color: '#9252AA' }}
      overlayColor="rgba(255, 255, 255, 1)" // Set overlay background color to white
      color="#9252AA" // Set spinner color to #9252AA
    />
  );
};

export default Loader;
