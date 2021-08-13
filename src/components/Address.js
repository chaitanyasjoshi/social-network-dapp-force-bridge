import React, { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export default function Address({ addressName, address }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className='input-group mb-3'>
      <div className='input-group-prepend'>
        <span className='input-group-text'>{addressName}</span>
      </div>
      <input
        type='text'
        className='form-control bg-white'
        value={address}
        disabled={true}
      />
      <div className='input-group-append'>
        <CopyToClipboard text={address} onCopy={() => setCopied(true)}>
          <button className='btn btn-outline-secondary' type='button'>
            {copied ? 'Copied' : 'Copy'}
          </button>
        </CopyToClipboard>
      </div>
    </div>
  );
}
