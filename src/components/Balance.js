import React from 'react';

export default function Balance({ asset, balance }) {
  return (
    <div className='input-group mb-3' style={{ width: 500 }}>
      <div className='input-group-prepend'>
        <span className='input-group-text'>{asset}</span>
      </div>
      <div className='col-xs-2'>
        <input
          type='text'
          className='form-control bg-white'
          value={balance}
          disabled={true}
        />
      </div>
    </div>
  );
}
