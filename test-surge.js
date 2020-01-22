const surge = require('surge')({ default: 'publish' });

const login = 'alex@matho.me';
const token = 'e010f454bfd5458ae73c47b3f98e8f57';

process.env.SURGE_LOGIN = login;
process.env.SURGE_TOKEN = token;

console.log(surge(['./test-dist', 'test-domain-sadfkjhio.surge.sh']));
