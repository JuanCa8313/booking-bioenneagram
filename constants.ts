import { Question, QuestionID } from "./types";

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
