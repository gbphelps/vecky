import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('/api').then((res) => res.text()).then(console.log);
  }, []);
  return <div>hello world it&apos;s me me me</div>;
}

export default App;
