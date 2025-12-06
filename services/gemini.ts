
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { BusinessInput, MarketingPlan } from "../types";

const apiKey = process.env.API_KEY;
// Using gemini-2.5-flash for speed and efficiency in generating structured plans
const MODEL_NAME = "gemini-2.5-flash"; 

if (!apiKey) {
  console.error("API_KEY is not defined in process.env");
}

const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const planSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    executiveSummary: { type: Type.STRING, description: "A brief professional summary of the strategy." },
    marketAnalysis: { type: Type.STRING, description: "Analysis of current market trends and general competition landscape." },
    competitorAnalysis: {
      type: Type.OBJECT,
      properties: {
        competitors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Name of a real or typical competitor in this space" },
              strengths: { type: Type.STRING },
              weaknesses: { type: Type.STRING },
            },
            required: ["name", "strengths", "weaknesses"],
          },
        },
        marketGap: { type: Type.STRING, description: "Celah pasar spesifik yang belum dimanfaatkan oleh kompetitor." },
      },
      required: ["competitors", "marketGap"],
    },
    targetPersona: { type: Type.STRING, description: "Detailed description of the ideal customer persona." },
    swot: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
        threats: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["strengths", "weaknesses", "opportunities", "threats"],
    },
    marketingMix: {
      type: Type.OBJECT,
      properties: {
        productStrategy: { type: Type.STRING },
        priceStrategy: { type: Type.STRING },
        placeStrategy: { type: Type.STRING },
        promotionStrategy: { type: Type.STRING },
      },
      required: ["productStrategy", "priceStrategy", "placeStrategy", "promotionStrategy"],
    },
    contentStrategy: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, description: "Platform (Instagram, TikTok, LinkedIn, Blog, etc)" },
          contentType: { type: Type.STRING, description: "Type (Reels, Carousel, Article, Story)" },
          topic: { type: Type.STRING, description: "Catchy title or topic" },
          description: { type: Type.STRING, description: "Brief detail of what the content is about" },
        },
        required: ["platform", "contentType", "topic", "description"],
      },
      description: "List of 6 specific content ideas for digital marketing channels."
    },
    actionPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          difficulty: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
        },
        required: ["title", "description", "impact", "difficulty"],
      },
    },
    riskAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          riskType: { type: Type.STRING, description: "Jenis risiko (e.g. Operasional, Finansial, Pasar)" },
          description: { type: Type.STRING, description: "Deskripsi risiko" },
          impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          mitigation: { type: Type.STRING, description: "Strategi mitigasi risiko" },
        },
        required: ["riskType", "description", "impact", "mitigation"],
      },
      description: "Analisis risiko potensial dan strategi mitigasi."
    },
    investmentRecommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          area: { type: Type.STRING, description: "Where to invest (e.g., SEO Tools, Ads, Equipment)" },
          reasoning: { type: Type.STRING, description: "Why this investment is crucial" },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          kpis: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "2-3 specific Key Performance Indicators (KPIs) to measure the ROI of this investment."
          }
        },
        required: ["area", "reasoning", "priority", "kpis"],
      },
      description: "Top 3 strategic areas where the business should invest money or resources."
    },
    estimatedGrowth: {
      type: Type.ARRAY,
      items: { type: Type.NUMBER },
      description: "Projected percentage growth for the next 6 months (e.g., [5, 10, 15, 22, 30, 40]) based on successful strategy implementation."
    }
  },
  required: ["executiveSummary", "marketAnalysis", "competitorAnalysis", "targetPersona", "swot", "marketingMix", "contentStrategy", "actionPlan", "riskAnalysis", "investmentRecommendations", "estimatedGrowth"],
};

export const generateMarketingPlan = async (input: BusinessInput): Promise<MarketingPlan> => {
  const prompt = `
    Bertindaklah sebagai Konsultan Pemasaran & Strategi Bisnis Senior (CMO level).
    Tolong buatkan rencana pemasaran dan bisnis strategis yang komprehensif untuk:
    
    Nama Bisnis: ${input.businessName}
    Industri: ${input.industry}
    Deskripsi: ${input.description}
    Target Audiens: ${input.targetAudience}
    Tujuan: ${input.goals}

    Analisis harus mendalam, profesional, dan dapat ditindaklanjuti. 
    1. Sertakan analisis kompetitor (sebutkan 3 kompetitor tipikal/nyata) dan celah pasar.
    2. Berikan rekomendasi investasi strategis (misalnya: alokasi budget untuk Ads, Tools, atau Influencer).
    3. Untuk setiap rekomendasi investasi, sertakan 2-3 KPI (Key Performance Indicators) spesifik untuk mengukur keberhasilannya.
    4. Berikan 6 ide konten digital marketing yang kreatif, spesifik, dan viral-potential (tentukan platform, tipe, dan topik).
    5. Identifikasi 3-5 risiko bisnis potensial dan strategi mitigasinya.
    Gunakan Bahasa Indonesia yang formal dan bisnis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: planSchema,
        systemInstruction: "Anda adalah ahli strategi pemasaran kelas dunia. Berikan analisis yang tajam, realistis, dan kreatif dalam Bahasa Indonesia.",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as MarketingPlan;
  } catch (error) {
    console.error("Error generating plan:", error);
    throw error;
  }
};

export const createChatSession = () => {
  return ai.chats.create({
    model: MODEL_NAME,
    config: {
      systemInstruction: "Anda adalah 'Marko', asisten strategi pemasaran AI. Anda membantu pengguna memahami rencana pemasaran mereka, menjawab pertanyaan tindak lanjut, memberikan ide konten spesifik, dan saran alokasi budget. Jawablah dengan profesional namun ramah dalam Bahasa Indonesia.",
    }
  });
};
