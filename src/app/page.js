'use client';
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [res, setRes] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setError('');
    setRes('');

    if (query === '') {
      setError('Please, enter a query.');
    } else {
      setLoading(true);
      console.log('oo', query);
      axios
        .post('http://localhost:3000/api/get-response', { query })
        .then((res) => {
          if (res.data) {
            setRes(res?.data);
          }
        })
        .catch((err) => {
          console.log(err);
          // setError(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <div className='main-container'>
        <h1>SQL Query Generator</h1>

        <p className='label'>Enter your question</p>
        <input
          className='input-field'
          type='text'
          name=''
          id=''
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button className='submit-btn' onClick={handleSubmit}>
          Submit
        </button>

        {res && (
          <div
            className='response'
            dangerouslySetInnerHTML={{ __html: res.replace(/\n/g, '<br>') }}
          ></div>
        )}
        {loading && <p className='loading'>Loading...</p>}
        {error && <p className='error'>{error}</p>}
      </div>
    </>
  );
}
