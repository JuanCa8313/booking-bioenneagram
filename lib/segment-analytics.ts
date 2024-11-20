// lib/analytics.ts
import { AnalyticsBrowser } from '@segment/analytics-next';

// Constante para la WRITE_KEY
const SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

// Interfaces para eventos de formulario
interface FormEvents {
  'Form Interaction': {
    formName: string;
    fieldName: string;
    fieldType: string;
    action: 'focus' | 'blur' | 'change' | 'click';
    value?: string;
  };
  'Form Submitted': {
    formName: string;
    formData: Record<string, string | number | boolean>;
    success: boolean;
  };
  'Form Validated': {
    formName: string;
    isValid: boolean;
    errors?: Record<string, string>;
  };
  'Form Completed': {
    formName: string;
    timeToComplete?: number;
    completionMethod: 'submit' | 'skip';
  };
  'Form Error': {
    formName: string;
    errorType: 'validation' | 'submission' | 'server';
    errorMessage: string;
    fieldName?: string;
  };
  'Question Answered': {
    questionId: string;
    questionText: string;
    answer: string;
    sequence: number;
  };
}

// Singleton para mantener una única instancia del servicio
class AnalyticsInstance {
  private static instance: AnalyticsService | null = null;

  static getInstance(): AnalyticsService {
    if (!this.instance) {
      this.instance = new AnalyticsService(SEGMENT_WRITE_KEY!);
    }
    return this.instance;
  }
}

// Clase principal de Analytics
class AnalyticsService {
  private client: ReturnType<typeof AnalyticsBrowser.load>;

  constructor(writeKey: string) {
    this.client = AnalyticsBrowser.load({ writeKey });
  }

  // Método genérico para trackear eventos
  track<K extends keyof FormEvents>(
    eventName: K,
    properties: FormEvents[K]
  ) {
    try {
      this.client.track(eventName, properties);
      if (process.env.NODE_ENV === 'development') {
        console.log(`Event Tracked: ${eventName}`, properties);
      }
    } catch (error) {
      console.error('Tracking Error:', error);
    }
  }

  // Método para trackear páginas
  page(
    category?: string,
    name?: string,
    properties?: Record<string, string | number | boolean>
  ) {
    try {
      this.client.page(category, name, properties);
    } catch (error) {
      console.error('Page Tracking Error:', error);
    }
  }
}

// Helper para obtener la instancia del servicio
const getAnalyticsService = () => AnalyticsInstance.getInstance();

export const segmentAnalytics = AnalyticsBrowser.load({
  writeKey: process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY!,
});

// Exportar la API pública
export const Analytics = {
  init: () => getAnalyticsService(),

  forms: {
    trackInteraction: (data: FormEvents['Form Interaction']) =>
      getAnalyticsService().track('Form Interaction', data),

    trackSubmission: (data: FormEvents['Form Submitted']) =>
      getAnalyticsService().track('Form Submitted', data),

    trackValidation: (data: FormEvents['Form Validated']) =>
      getAnalyticsService().track('Form Validated', data),

    trackCompletion: (data: FormEvents['Form Completed']) =>
      getAnalyticsService().track('Form Completed', data),

    trackError: (data: FormEvents['Form Error']) =>
      getAnalyticsService().track('Form Error', data)
  },

  questions: {
    trackAnswer: (data: FormEvents['Question Answered']) =>
      getAnalyticsService().track('Question Answered', data)
  }
};

// Tipo exportado para uso en otros componentes
export type { FormEvents };