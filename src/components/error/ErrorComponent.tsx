import React from 'react'

export function ErrorComponent({ error }: { error: Error }) {
  return (
    <div className="p-4">
      <h1>Error: {error.message}</h1>
    </div>
  )
} 