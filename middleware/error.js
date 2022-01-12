function error(message, error) {
  console.log('Something is broken!', error.message);
  console.log('---- Full error log ----');
  console.log(error);
}

export default error
