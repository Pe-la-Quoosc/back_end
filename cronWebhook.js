const cron = require('node-cron');
const { processWebhookOrders } = require('./controller/userCtrl');

// Tạo fake req, res để gọi hàm
const fakeReq = { body: {}, query: {} };
const fakeRes = { 
  json: () => {}, 
  status: () => ({ json: () => {} }) 
};

cron.schedule('*/15 * * * * *', async () => {
  await processWebhookOrders(fakeReq, fakeRes);
  console.log('Đã xử lý webhook lúc', new Date());
});