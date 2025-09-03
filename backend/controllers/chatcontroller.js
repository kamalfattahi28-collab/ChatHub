const pool=require('../db')

exports.getMessage=async(req,res)=>{
    try {
        const room=req.query.room || 'general';
        const [messages]=await pool.query('SELECT m.*, u.username FROM messages m JOIN users u ON m.user_id = u.id WHERE m.room=? ORDER BY m.created_at DESC',
        [room]
        );
        res.json({messages});
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({error: 'Failed to fetch messages'});
    }
}