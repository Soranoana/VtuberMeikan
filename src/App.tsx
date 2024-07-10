import React from 'react';
import page from '@/src/page';

function App() {
  const pageTop = page() as React.JSX.Element;
  return (
    <div>
      {pageTop}
    </div>
  )
}

export default App;
