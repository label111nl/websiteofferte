import express from 'express';
const router = express.Router();

// GET /api/marketeer/profile
router.get('/profile', async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/marketeer/dashboard
router.get('/dashboard', async (req, res) => {
    try {
        // Dashboard data ophalen
        res.json({
            success: true,
            data: {
                leads: [],
                stats: {
                    totalLeads: 0,
                    activeLeads: 0,
                    completedLeads: 0
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;