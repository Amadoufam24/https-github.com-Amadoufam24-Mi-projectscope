import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Change process.env.API_KEY to import.meta.env.VITE_API_KEY for Vite compatibility
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING, description: "Nombre sugerido para el proyecto" },
    summary: { type: Type.STRING, description: "Resumen ejecutivo de los requerimientos extraídos" },
    budget: {
      type: Type.ARRAY,
      description: "Desglose del presupuesto estimado",
      items: {
        type: Type.OBJECT,
        properties: {
          item: { type: Type.STRING, description: "Nombre de la tarea o funcionalidad" },
          category: { type: Type.STRING, description: "Categoría (Backend, Frontend, Diseño, DevOps, Gestión)" },
          estimatedCost: { type: Type.NUMBER, description: "Costo estimado en USD" },
          estimatedHours: { type: Type.NUMBER, description: "Horas estimadas de trabajo" }
        },
        required: ["item", "category", "estimatedCost", "estimatedHours"]
      }
    },
    milestones: {
      type: Type.ARRAY,
      description: "Hitos principales del proyecto",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Título del hito" },
          description: { type: Type.STRING, description: "Descripción de los entregables" },
          weekEstimate: { type: Type.NUMBER, description: "Semana estimada de entrega (número)" }
        },
        required: ["title", "description", "weekEstimate"]
      }
    },
    userStories: {
      type: Type.ARRAY,
      description: "Historias de usuario en formato Scrum",
      items: {
        type: Type.OBJECT,
        properties: {
          role: { type: Type.STRING, description: "Como [rol]" },
          action: { type: Type.STRING, description: "Quiero [acción]" },
          benefit: { type: Type.STRING, description: "Para [beneficio]" },
          priority: { type: Type.STRING, description: "Prioridad (Alta, Media, Baja)" }
        },
        required: ["role", "action", "benefit", "priority"]
      }
    }
  },
  required: ["projectName", "summary", "budget", "milestones", "userStories"]
};

export const analyzeTranscript = async (transcript: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Eres un experto Project Manager y Analista de Negocio Senior.
        Tu tarea es analizar la siguiente transcripción de una reunión con un cliente.
        Debes extraer y estructurar la información en un plan de proyecto coherente.
        
        La transcripción es:
        "${transcript}"
        
        Genera una respuesta en formato JSON estrictamente siguiendo el esquema proporcionado.
        Asegúrate de que el presupuesto sea realista y las historias de usuario sigan el formato estándar.
        Responde completamente en Español.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from Gemini");
    }

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing transcript:", error);
    throw error;
  }
};