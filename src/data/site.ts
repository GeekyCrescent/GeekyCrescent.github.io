// Every string here comes from cv-maestro.md (see 03-life/carrera/portafolio-design.md).

export const SITE = {
  name: 'Juan Rodrigo Ferro',
  shortName: 'Ferro',
  title: 'Ferro | Cloud & AI engineer',
  description:
    'Software engineer in Sydney. I take a client problem from the first meeting to a cloud architecture and a working system: AWS, GCP and production generative AI.',
  headline: 'Cloud & AI, built around the client.',
  intro:
    'Software engineer in Sydney. I take a client problem from the first meeting to a cloud architecture and a working system.',
  workRights:
    'Based in Sydney · Student visa with work rights (48 h/fortnight during session, unrestricted in breaks)',
  heroFigures: [
    { value: '6×-36×', label: 'transcription cost saving modelled' },
    { value: '20/24', label: 'security audit findings closed' },
    { value: '2 Pro', label: 'GenAI certifications, AWS and Oracle' },
  ],
  approach: [
    { verb: 'Understand', text: 'Requirements from non-technical people, captured in their own language.' },
    { verb: 'Propose', text: 'Architectures with alternatives, costs and trade-offs I can defend.' },
    { verb: 'Build', text: 'AWS serverless, LLM agents and full-stack TypeScript, with tests.' },
  ],
  certifications: [
    { name: 'Generative AI Developer, Professional', issuer: 'AWS', isPro: true },
    { name: 'OCI 2025 Generative AI Professional', issuer: 'Oracle', isPro: true },
    { name: 'AI Practitioner', issuer: 'AWS', isPro: false },
    { name: 'OCI 2025 AI Foundations Associate', issuer: 'Oracle', isPro: false },
    { name: 'Cloud Practitioner', issuer: 'AWS', isPro: false },
  ],
  otherProjects: [
    {
      name: 'FraudFishing',
      text: 'Team project: fraud-report platform with a NestJS API, a React web app and MySQL.',
      url: 'https://github.com/GeekyCrescent/fraud-fishing-JS',
    },
    {
      name: 'todo-ferro',
      text: 'A task app as a React web client and an Expo mobile client.',
      url: 'https://github.com/GeekyCrescent/todo-ferro-web',
    },
    {
      name: 'Book-collection RAG chatbot',
      text: 'Volunteer project for a community group of about 300 people: Qdrant, reranking, hard-negative evaluation.',
    },
  ],
  about: [
    'Software engineer at BWR, a Mexican software consultancy, working remotely from Sydney on cloud and generative AI.',
    'Master of Information Systems Management at Macquarie University (in progress). B.Eng. in Computer Technology at Tec de Monterrey (in progress).',
    'DigiEduHack winner, 2025. Spanish (native), English (full professional), German (limited working).',
  ],
  contact: {
    email: 'ferro.rayon@gmail.com',
    linkedin: 'https://www.linkedin.com/in/juan-rodrigo-ferro-rayón-7a0039334',
    github: 'https://github.com/GeekyCrescent',
    cv: '/cv.pdf',
  },
} as const;
