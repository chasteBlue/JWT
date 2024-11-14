const express = require('express'); 
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabaseUrl = 'https://exlszobxbiswpwhckxlj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4bHN6b2J4Ymlzd3B3aGNreGxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODQ2MDU5MywiZXhwIjoyMDQ0MDM2NTkzfQ.F8Pz6hGDwVH_ULJ2MQTtC5Rp6mordnk5FgugPEa7jRc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Access denied' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Login route
router.post('/login', async (req, res) => {
    const { email } = req.body;

    const { data: users, error } = await supabase
        .from('SCHEDULER')
        .select('scheduler_id, fname, lname, email, contact_number')
        .eq('email', email);

    if (error || !users || users.length === 0) {
        return res.status(401).json({ message: 'Invalid login credentials' });
    }

    const user = users[0];
    const token = jwt.sign({ scheduler_id: user.scheduler_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

// Protected route to get user details
router.get('/protected', authenticateToken, async (req, res) => {
    const { scheduler_id } = req.user;

    const { data: user, error } = await supabase
        .from('SCHEDULER')
        .select('fname, lname, email, contact_number')
        .eq('scheduler_id', scheduler_id)
        .single();

    if (error || !user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
});

module.exports = router;
