// lib/segment-analytics.ts
import { AnalyticsBrowser } from '@segment/analytics-next';

const SEGMENT_WRITE_KEY = process.env.NEXT_PUBLIC_SEGMENT_WRITE_KEY;

let segmentAnalytics: ReturnType<typeof AnalyticsBrowser.load>;

// Verificar si estamos en el cliente
const isClient = typeof window !== 'undefined';

// Inicializar analytics solo en el cliente
if (isClient) {
  segmentAnalytics = AnalyticsBrowser.load({
    writeKey: SEGMENT_WRITE_KEY!,
  });
}

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
    formData: Record<string, FormDataEntryValue>;
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

class AnalyticsService {
  track<K extends keyof FormEvents>(eventName: K, properties: FormEvents[K]) {
    if (isClient) {
      try {
        segmentAnalytics.track(eventName, properties);
        if (process.env.NODE_ENV === 'development') {
          console.log(`Event Tracked: ${eventName}`, properties);
        }
      } catch (error) {
        console.error('Tracking Error:', error);
      }
    }
  }

  page(
    category?: string,
    name?: string,
    properties?: Record<string, string | number | boolean>
  ) {
    if (isClient) {
      try {
        segmentAnalytics.page(category, name, properties);
      } catch (error) {
        console.error('Page Tracking Error:', error);
      }
    }
  }
}

// Singleton para mantener una única instancia del servicio
class AnalyticsInstance {
  private static instance: AnalyticsService | null = null;

  static getInstance(): AnalyticsService {
    if (!this.instance) {
      this.instance = new AnalyticsService();
    }
    return this.instance;
  }
}

// Helper para obtener la instancia del servicio
const getAnalyticsService = () => AnalyticsInstance.getInstance();

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

export { segmentAnalytics };
export type { FormEvents };