// require('dotenv').config()
// const app=require('./src/app')
// const PORT=process.env.PORT || 3000;

// app.listen(PORT,()=>{
//     console.log(`Server is running on port ${PORT}`);
// })

// app.listen(3000,()=>{
//     console.log('Server is running ');
// })

require('dotenv').config();
const app = require('./src/app');

// Export the Express app for Vercel to use
module.exports = app;