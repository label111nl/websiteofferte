import 'dotenv/config'; // This automatically calls dotenv.config()
import express from 'express';
import http from 'http';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';
import history from 'connect-history-api-fallback';

const app = express();
const port = process.env.PORT || 3030;

// Supabase client
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Parse JSON bodies
app.use(express.json());

const asyncHandler = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

// API routes first
app.use('/api', asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: "No authentication token found" });
    }
    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid authentication token" });
    }
}));

// Update this line to use ES module import
import marketeerRoutes from './routes/marketeer.mjs';
app.use('/api/marketeer', marketeerRoutes);

// Specifieke routes voor static files
app.use('/assets', express.static(join(process.cwd(), 'dist/assets')));
app.use('/vite.svg', express.static(join(process.cwd(), 'dist/vite.svg')));

// History API fallback voor SPA
app.use(history({
    rewrites: [
        { from: /\/api/, to: ({ parsedUrl }) => parsedUrl.pathname }
    ]
}));

// Algemene static file serving
app.use(express.static(join(process.cwd(), 'dist')));

const server = http.createServer(app);
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});