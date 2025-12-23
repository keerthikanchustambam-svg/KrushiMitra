const { spawn } = require('child_process');

// Read PORT from environment (Render sets this). Default to 5173 for local preview.
const port = process.env.PORT || '5173';

// Start `vite preview` with explicit host and port. Use npx to ensure local vite is executed.
const args = ['vite', 'preview', '--host', '0.0.0.0', '--port', port];

console.log(`Starting Vite preview on 0.0.0.0:${port}`);

const child = spawn('npx', args, { stdio: 'inherit', shell: process.platform === 'win32' });

child.on('close', (code) => {
  process.exit(code);
});
