/**
 * Node.js server example showing lazy-import for backend optimization
 */
const express = require('express');
const lazy = require('lazy-import').default;

// Lazy load heavy server dependencies
const loadImageProcessor = lazy('./services/imageProcessor');
const loadPdfGenerator = lazy('./services/pdfGenerator');
const loadEmailService = lazy('./services/emailService');
const loadAnalytics = lazy('./services/analytics');
const loadFileUpload = lazy('multer');

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));

// Basic route (no lazy loading needed)
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Image processing endpoint - loads processor only when needed
app.post('/api/images/process', async (req, res) => {
  try {
    console.log('Loading image processor...');
    const imageProcessor = await loadImageProcessor();
    
    const result = await imageProcessor.processImage(req.body.imageData, {
      resize: req.body.resize,
      format: req.body.format,
      quality: req.body.quality
    });
    
    res.json(result);
  } catch (error) {
    console.error('Image processing failed:', error);
    res.status(500).json({ error: 'Image processing failed' });
  }
});

// PDF generation endpoint
app.post('/api/pdf/generate', async (req, res) => {
  try {
    console.log('Loading PDF generator...');
    const pdfGenerator = await loadPdfGenerator();
    
    const pdf = await pdfGenerator.createPdf({
      template: req.body.template,
      data: req.body.data,
      options: req.body.options
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
    res.send(pdf);
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// Email sending endpoint
app.post('/api/email/send', async (req, res) => {
  try {
    console.log('Loading email service...');
    const emailService = await loadEmailService();
    
    await emailService.sendEmail({
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.html,
      attachments: req.body.attachments
    });
    
    res.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email sending failed:', error);
    res.status(500).json({ error: 'Email sending failed' });
  }
});

// File upload endpoint with lazy-loaded multer
app.post('/api/upload', async (req, res) => {
  try {
    console.log('Loading file upload middleware...');
    const multer = await loadFileUpload();
    
    const upload = multer.default({
      storage: multer.memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 } // 10MB
    });
    
    // Use multer middleware
    upload.single('file')(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      res.json({
        message: 'File uploaded successfully',
        filename: req.file.originalname,
        size: req.file.size
      });
    });
  } catch (error) {
    console.error('File upload failed:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
});

// Analytics endpoint - preload for faster response
app.get('/api/analytics/:type', async (req, res) => {
  try {
    console.log('Loading analytics service...');
    const analytics = await loadAnalytics();
    
    const data = await analytics.generateReport(req.params.type, {
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      filters: req.query.filters
    });
    
    res.json(data);
  } catch (error) {
    console.error('Analytics failed:', error);
    res.status(500).json({ error: 'Analytics generation failed' });
  }
});

// Health check with module preloading
app.get('/api/health', async (req, res) => {
  const status = {
    server: 'ok',
    timestamp: new Date().toISOString(),
    modules: {}
  };
  
  // Optional: preload modules for faster subsequent requests
  if (req.query.preload === 'true') {
    console.log('Preloading modules...');
    
    try {
      await Promise.all([
        lazy.preload('./services/imageProcessor'),
        lazy.preload('./services/pdfGenerator'),
        lazy.preload('./services/emailService')
      ]);
      status.modules.preloaded = true;
    } catch (error) {
      status.modules.preloadError = error.message;
    }
  }
  
  res.json(status);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Graceful startup with module preloading
async function startServer() {
  const PORT = process.env.PORT || 3000;
  
  // Optional: preload commonly used modules on startup
  if (process.env.PRELOAD_MODULES === 'true') {
    console.log('Preloading common modules...');
    try {
      await Promise.all([
        lazy.preload('./services/analytics'), // Analytics are used frequently
        // Note: Don't preload heavy modules like imageProcessor
      ]);
      console.log('Common modules preloaded');
    } catch (error) {
      console.warn('Module preloading failed:', error.message);
    }
  }
  
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });
}

if (require.main === module) {
  startServer().catch(console.error);
}

module.exports = app;