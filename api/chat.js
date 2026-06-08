import 'dotenv/config';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from './lib/db.js';
import Lead from './models/Lead.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SCHOOL_KNOWLEDGE_BASE = {
  schoolName: "Vedanta International School",
  sections: [
    "About Us: Vedanta International School is a premier educational institution focused on holistic development, combining modern education with traditional values.",
    "Admissions: Admissions are open for all classes. We require student details, previous academic records, and parent information. Process involves an entrance test and interaction.",
    "Academics: We offer CBSE curriculum focusing on STEM, Humanities, and Commerce streams in higher secondary.",
    "Facilities: State-of-the-art smart classrooms, physics/chemistry/biology/computer labs, massive library, indoor sports complex, swimming pool, and cafeteria.",
    "Transport: We have a fleet of 20 GPS-enabled air-conditioned buses covering a 30km radius around the school.",
    "Events: Annual Sports Day in December, Cultural Fest in February, Science Exhibition in October.",
    "Contact: Phone: +91-9876543210, Email: info@vedantainternational.com, Address: 123 Education Boulevard, City.",
    "Faculty: Over 50 highly qualified teachers with master's degrees and B.Ed. qualifications. Student-teacher ratio is 20:1.",
    "Achievements: Best School Award 2025, National Level Sports Champions in Basketball."
  ]
};

const SYSTEM_PROMPT = `
You are Vedanta International School's official AI Assistant.
Your role is to help parents, students, and visitors with school-related questions.

Rules:
- Answer only school-related queries based on the provided Knowledge Base.
- Be polite, professional, and concise.
- Never invent information. If information is unavailable, ask the user to contact the school administration.
- Guide users toward admissions and contact information when appropriate.
- Never discuss harmful, illegal, political, or unrelated topics.

Knowledge Base:
${JSON.stringify(SCHOOL_KNOWLEDGE_BASE, null, 2)}

Lead Generation Rule:
If a user asks about admissions or how to apply, you must collect their information to generate a lead. 
Politely ask for these 5 details (you can ask them one by one or all at once):
1. Student Name
2. Parent Name
3. Mobile Number
4. Email
5. Class Applying For

Once the user has provided ALL 5 pieces of information, you MUST append the following exact format at the very end of your final response thanking them:
[LEAD_DATA: {"studentName": "...", "parentName": "...", "phone": "...", "email": "...", "classApplyingFor": "..."}]
`;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing in environment variables.");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Format history for Gemini
    const formattedHistory = history ? history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    })) : [];

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    let replyText = result.response.text();

    // Check if lead data was generated
    const leadRegex = /\[LEAD_DATA:\s*({.*?})\s*\]/is;
    const match = replyText.match(leadRegex);

    if (match && match[1]) {
      try {
        const leadData = JSON.parse(match[1]);
        
        // Connect to DB and save lead
        if (process.env.MONGODB_URI) {
          await dbConnect();
          const newLead = new Lead(leadData);
          await newLead.save();
          console.log("New admission lead saved successfully:", leadData);
        } else {
          console.warn("MONGODB_URI is not set. Lead generated but not saved to DB.", leadData);
        }

        // Remove the JSON string from the response sent back to the user
        replyText = replyText.replace(match[0], '').trim();
      } catch (err) {
        console.error("Error parsing or saving lead data:", err);
      }
    }

    return res.status(200).json({ reply: replyText });

  } catch (error) {
    console.error('Chat API Error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
