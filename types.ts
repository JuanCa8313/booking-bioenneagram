// types.ts
export type QuestionID = 'initial' | 'referred' | 'welcome_back' | 'new_user' | 'referral_form';
export type AnswerOption = 'SI' | 'NO';

export interface Question {
  id: QuestionID;
  text: string;
  step: number;
  options: Partial<Record<AnswerOption, QuestionID>>;
}

export interface FinalStepProps {
  title?: string;
}

// constants.ts
export const QUESTIONS: Record<QuestionID, Question> = {
  initial: {
    id: 'initial',
    text: "¿ES TU PRIMERA VEZ CON NOSOTROS?",
    step: 1,
    options: { SI: "referred", NO: "welcome_back" }
  },
  referred: {
    id: 'referred',
    text: "¿ERES REFERIDO?",
    step: 2,
    options: { SI: "referral_form", NO: "new_user" }
  },
  welcome_back: {
    id: 'welcome_back',
    text: "¡BIENVENIDO DE VUELTA!",
    step: 4,
    options: {}
  },
  new_user: {
    id: 'new_user',
    text: "¡BIENVENIDO A BIOENNEGRAM!",
    step: 4,
    options: {}
  },
  referral_form: {
    id: 'referral_form',
    step: 3,
    text: "",
    options: {}
  }
};