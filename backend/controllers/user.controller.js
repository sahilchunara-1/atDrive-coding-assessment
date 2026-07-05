import { pool } from '../connections/mysql.js';
import bcrypt from 'bcrypt';
import generateToken from '../helpers/common.helper.js';

const userController = {
    register: async (req, res) => {
        const { username, password } = req.body;
        try {
            const [existingUser] = await pool.query('SELECT * FROM users WHERE username = ? AND is_deleted = FALSE', [username]);
            if (existingUser.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Username already exists'
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);

            const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
            const [result] = await pool.query(insertQuery, [username, hashedPassword]);
        
            if (result.affectedRows === 1) {
                return res.status(201).json({
                    success: true,
                    message: 'User registered successfully',
                    data: { userId: result.insertId, username },
                });
            }

            return res.status(500).json({ 
                success: false, 
                message: 'Failed to register user, please try again' 
            });

        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            const [users] = await pool.query(
                'SELECT * FROM users WHERE username = ? AND is_deleted = FALSE',
                [username]
            );
            const user = users[0];

            if (!user) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid username or password' 
                });
            }

            if (!user.is_active) {
                return res.status(403).json({ 
                    success: false, 
                    message: 'Account is inactive. Contact support.' 
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ 
                    success: false, 
                    message: 'Invalid username or password' 
                });
            }

            const token = generateToken({ id: user.id, username: user.username });

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: { id: user.id, username: user.username, token },
            });
        } catch (error) {
            console.log('error in login --->', error);
            return res.status(500).json({ 
                success: false, 
                message: error.message 
            });
        }
    },
};

export default userController;
