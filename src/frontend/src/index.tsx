import ReactDOM from 'react-dom';
import App from './App';
import './styles/global.scss';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  ReactDOM.render(<App />, root);
});
