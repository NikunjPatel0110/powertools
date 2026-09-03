import { useState, useEffect } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className={`toast ${type}`}>
      <span className="material-symbols-outlined" style={{ fontSize: 18, verticalAlign: 'middle', marginRight: 8 }}>
        {type === 'success' ? 'check_circle' : 'error'}
      </span>
      {message}
    </div>
  )
}
