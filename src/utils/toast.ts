import { toast, setDefaults } from 'bulma-toast';

export function showToast(err, options = {}) {
  // try to get a string from the error object
  const message = err.message || err.toString();

  // options will be merged with these and the defaults
  // will be used if the fields are not provided.
  setDefaults({
    closeOnClick: true,
    dismissible: true,
    duration: 2000,
    opacity: 1,
    position: 'top-right',
    type: 'is-warning',
  });

  // show toast to user
  toast({
    ...options,
    message,
  });
}
