const bcrypt = require('bcryptjs');
const db = require('../config/db');
const jwt = require('jsonwebtoken');


const getUserByEmail = async (email) => {
  const [rows] = await db.promise().query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

// Kullanıcının grubunun izinlerini almak için fonksiyon
const getGroupPermissions = async (groupId) => {
  const [rows] = await db.promise().query(`
    SELECT p.id, p.name, p.value, p.description 
    FROM permissions p
    JOIN group_permissions gp ON p.id = gp.permission_id
    WHERE gp.group_id = ?
  `, [groupId]);
  return rows;
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await getUserByEmail(email);
  console.log(user);
  
  if (!user) {
    return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Geçersiz şifre' });
  }

  // Kullanıcının grubundaki izinleri al
  const groupPermissions = await getGroupPermissions(user.group_id);
  
  // JWT token oluştur
  const token = jwt.sign({ userId: user.id, role: user.role }, 'secret-key', { expiresIn: '1h' });

  // Yanıtla birlikte kullanıcı verisi, token ve izinleri gönder
  res.status(200).json({ user, token, permissions: groupPermissions });
};
