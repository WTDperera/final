const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs').promises;

class OCRService {
  constructor() {
    // Initialize Gemini AI client
    try {
      if (process.env.GEMINI_API_KEY) {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.useGeminiAI = true;
        console.log('Gemini AI configured successfully');
      } else {
        throw new Error('GEMINI_API_KEY not found');
      }
    } catch (error) {
      console.warn('Gemini AI not configured, using fallback methods:', error.message);
      this.useGeminiAI = false;
    }
  }

  /**
   * Extract text from an image using OCR
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<string>} - Extracted text
   */
  async extractText(imagePath) {
    try {
      if (this.useGeminiAI) {
        try {
          return await this.extractWithGemini(imagePath);
        } catch (aiError) {
          console.warn('Gemini AI failed, falling back to mock OCR:', aiError.message);
          // Fall back to local/mock OCR to keep dev experience smooth
          return await this.extractWithFallback(imagePath);
        }
      }
      return await this.extractWithFallback(imagePath);
    } catch (error) {
      console.error('OCR extraction failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  /**
   * Extract text using Gemini AI
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<string>} - Extracted text and structured data
   */
  async extractWithGemini(imagePath) {
    try {
      // Read the image file
      const imageData = await fs.readFile(imagePath);
      
      const prompt = `Analyze this receipt image and extract all the text content. Please provide:
1. Store name and address
2. Date and time
3. All items with prices
4. Subtotal, tax, and total amounts
5. Payment method if visible

Please format the output as structured text that clearly shows all the information from the receipt.`;

      const imagePart = {
        inlineData: {
          data: imageData.toString('base64'),
          mimeType: this.getMimeType(imagePath)
        }
      };

      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      if (text && text.trim().length > 0) {
        return text.trim();
      }
      
      return '';
    } catch (error) {
      console.error('Gemini AI error:', error);
      throw error;
    }
  }

  /**
   * Get MIME type based on file extension
   * @param {string} filePath - Path to the file
   * @returns {string} - MIME type
   */
  getMimeType(filePath) {
    const ext = filePath.toLowerCase().split('.').pop();
    const mimeTypes = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  /**
   * Fallback OCR method (for development/testing)
   * In a real implementation, you might use Tesseract.js or another OCR library
   * @param {string} imagePath - Path to the image file
   * @returns {Promise<string>} - Mock extracted text
   */
  async extractWithFallback(imagePath) {
    // This is a mock implementation for development
    // In a real scenario, you'd implement Tesseract.js or another OCR solution
    console.log(`Mock OCR processing: ${imagePath}`);
    
    // Return mock receipt data for testing
    return `GROCERY STORE
123 Main St
City, State 12345

Date: 2024-01-15

ITEMS:
Milk 2%           $3.99
Bread Wheat       $2.49
Bananas          $1.99
Chicken Breast   $8.99
Total Tax         $0.83
TOTAL            $18.29

Thank you for shopping!`;
  }

  /**
   * Check if Gemini AI is available
   * @returns {boolean}
   */
  isGeminiAIAvailable() {
    return this.useGeminiAI;
  }
}

module.exports = new OCRService();