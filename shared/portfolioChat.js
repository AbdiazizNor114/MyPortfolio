export const MAX_MESSAGE_LENGTH = 1200;
export const MAX_HISTORY = 10;
export const TOPICS = ['intro', 'skills', 'education', 'projects', 'services', 'automation', 'ml', 'databases', 'contact', 'availability', 'unknown'];
export const SCOPE_MESSAGE = "I can help with Abdiaziz’s background, skills, education, projects, services, and contact details. I only answer questions about his portfolio.";
export const FACTS = {
  intro: 'Abdiaziz Nor is a System Developer and AI enthusiast based in Sweden, focused on backend systems, APIs, React applications, and practical AI automation.',
  skills: 'His portfolio lists React, Tailwind CSS, JavaScript, TypeScript, Node.js, Python, Java, C#, Dart, Flutter, Firebase, MongoDB, API development, Git, and machine learning with Python. This site also uses Supabase.',
  education: 'He studies Information Systems with a Data Science focus at Högskolan Dalarna. His listed coursework includes AI, Data Science & Machine Learning, Database Systems, web applications, responsive web design, and IT Project Management. He also completed CCNA: Introduction to Networks.',
  projects: 'This portfolio uses React, Vite, Tailwind CSS, Supabase, and EmailJS. Its admin area manages projects, blog posts, and media uploads. You can explore his published projects in the Projects section.',
  services: 'His listed services include backend development, REST API design, React websites, database design, AI automation, system optimization, and cloud deployment support. Use the contact form to discuss a specific project.',
  automation: 'His AI automation focus includes workflow assistants, document summarization, support helpers, smart reporting, and API integrations that reduce repetitive work.',
  ml: 'His machine learning experience is connected to his Data Science studies, with Python-based data analysis and basic model-training practice.',
  databases: 'His portfolio lists Firebase and MongoDB among his skills. This site now uses Supabase for projects, blog posts, authentication, and media storage.',
  contact: 'Use the contact form on this site, LinkedIn, or WhatsApp from the homepage. You can review his code on GitHub: https://github.com/AbdiazizNor114. LinkedIn: https://www.linkedin.com/in/abdiaziiz-abdullahi-066a74232/.',
  availability: 'Please contact Abdiaziz directly about internships, developer roles, collaborations, or client projects. Current availability, pricing, and schedules are not confirmed in the portfolio.',
};
const patterns = [
  ['contact', /\b(contact|hire|reach|email|linkedin|whatsapp)\b/i],
  ['education', /\b(education|stud(?:y|ies|ying)|school|university|college|course|ccna|degree)\b/i],
  ['availability', /\b(available|availability|internship|job|opportunity|freelance|price|pricing|schedule)\b/i],
  ['automation', /\b(automation|workflow|agent|summari[sz]er|chatbot)\b/i],
  ['ml', /\b(machine learning|ml|data science|ai experience)\b/i],
  ['databases', /\b(database|databases|supabase|firestore|firebase|mongodb|sql)\b/i],
  ['skills', /\b(skills?|stack|technolog(?:y|ies)|strongest|tools|languages?|react|python|javascript|typescript)\b/i],
  ['projects', /\b(projects?|portfolio|built|github|shaqonet|smartdo|bank)\b/i],
  ['services', /\b(services?|offers?|client|business|build for|help with)\b/i],
  ['intro', /\b(who|background|introduce|abdiaziz|aziz|about (?:you|him))\b/i],
];
const followUp = /^(?:tell me more|more|explain|details|go on|continue|what else|why|from where|where|source|how do you know)[?.!\s]*$/i;
export function routeLocally(question, conversation = [], projects = []) {
  if (/^(hi|hello|hey|good (morning|afternoon|evening))[!.\s]*$/i.test(question)) return { topic: 'intro' };
  if (/ignore.*instructions|system prompt|write (?:me )?(?:code|an essay)|solve|weather|recipe|capital of/i.test(question)) return { topic: 'unknown' };
  const project = projects.find(p => p.title && question.toLowerCase().includes(p.title.toLowerCase()));
  if (project) return { topic: 'projects', projectId: String(project.id) };
  if (followUp.test(question)) {
    for (const message of [...conversation].reverse()) {
      if (message.sender === 'user' && !followUp.test(message.text)) {
        const route = routeLocally(message.text, [], projects);
        if (route.topic !== 'unknown') return { ...route, detail: true };
      }
    }
  }
  return { topic: patterns.find(([, pattern]) => pattern.test(question))?.[0] || 'unknown' };
}
export function answerFromFacts(route, projects = []) {
  if (!TOPICS.includes(route?.topic) || route.topic === 'unknown') return SCOPE_MESSAGE;
  if (route.topic === 'projects' && projects.length) {
    const project = projects.find(p => String(p.id) === route.projectId);
    if (project) {
      const summary = String(project.desc || project.content || '').replace(/^#{1,6}\s*/gm, '').replace(/[*_`]/g, '').slice(0, route.detail ? 1800 : 1000);
      return `${project.title}\n\n${summary || 'Open this project in the Projects section for details.'}${project.tech ? '\n\nTech: ' + project.tech : ''}${project.github ? '\n\nCode: ' + project.github : ''}${project.demo ? '\nLive demo: ' + project.demo : ''}`;
    }
    return `Published projects include ${projects.map(p => p.title).filter(Boolean).join(', ')}. Open the Projects section for case studies, source code, and live demos.\n\n${FACTS.projects}`;
  }
  return FACTS[route.topic];
}
export function getPortfolioAnswer(question, conversation = [], projects = []) {
  return answerFromFacts(routeLocally(question, conversation, projects), projects);
}
