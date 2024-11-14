const express = require('express');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabaseUrl = 'https://exlszobxbiswpwhckxlj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4bHN6b2J4Ymlzd3B3aGNreGxqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyODQ2MDU5MywiZXhwIjoyMDQ0MDM2NTkzfQ.F8Pz6hGDwVH_ULJ2MQTtC5Rp6mordnk5FgugPEa7jRc';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Route for login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const { data: users, error } = await supabase
        .from('SCHEDULER')
        .select('*')
        .eq('email', email)
        .eq('password', password); // Add password verification

    if (error || !users || users.length === 0) {
        return res.status(401).json({ message: 'Invalid login credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

module.exports = router;
