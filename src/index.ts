import app from './app';
import './utils/db'
import { log } from './utils/logger';

const port = process.env.PORT || 5000;
app.listen(port, () => {
  /* eslint-disable no-console */
  log.info(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});
