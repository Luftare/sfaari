const port = process.env.PORT || 8000;
const { init, app } = require('./app');

init().then(() => {
  app.listen(port, () => console.log(`API running at: ${port}`));
});
