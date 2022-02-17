import React from 'react';

const Form: React.FunctionComponent<{onSubmit: () => void}> = ({
  onSubmit,
  children,
}) => (
  <form
    onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
  >
    {children}
  </form>
);

export default Form;
