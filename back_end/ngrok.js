const ngrok = require('ngrok');

(async function() {
  const url = await ngrok.connect(3002);
  console.log('Public URL:', url);
})();