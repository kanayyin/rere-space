import bcrypt from '../node_modules/bcrypt';
const hash = await bcrypt.hash('admin123', 10);
console.log(hash);