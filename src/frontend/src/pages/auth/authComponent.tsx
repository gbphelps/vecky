import { useState, useCallback } from 'react';
import styles from './index.module.scss';
import { TUserForm } from '../../common/contexts/sessionContext';
// import StyleGuide from '../_styleGuide';

interface Props {
  title: string,
  onSubmit: (form: TUserForm) => Promise<void>
}

function AuthComponent({ title, onSubmit }: Props) {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const onChange = useCallback(({ target: { value, name } }) => {
    setForm((oldForm) => ({
      ...oldForm,
      [name]: value,
    }));
  }, []);

  return (
    <div className={styles['page-container']}>
      <div className={styles.container}>
        <h4>{title}</h4>
        <label htmlFor="username">
          <div>Username</div>
          <input
            type="text"
            value={form.username}
            onChange={onChange}
            name="username"
          />
        </label>

        <label htmlFor="password">
          <div>Password</div>
          <input
            type="password"
            value={form.password}
            onChange={onChange}
            name="password"
          />
        </label>

        <div className={styles['button-panel']}>
          <button type="button" onClick={() => onSubmit(form)}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
