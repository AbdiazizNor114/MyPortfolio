export const MAX_MESSAGE_LENGTH = 1200;
export const MAX_HISTORY = 10;
export const TOPICS = ['intro', 'skills', 'education', 'high_school', 'university', 'diplomas', 'courses', 'cv', 'experience', 'projects', 'services', 'automation', 'ml', 'databases', 'contact', 'availability', 'unknown'];
export const SCOPE_MESSAGE = "I can help with Abdiaziz’s background, skills, education, high school, diplomas, CV, projects, services, and contact details. I only answer questions about his portfolio.";
export const FACTS = {
  intro: 'Abdiaziz Nor is a System Developer and AI enthusiast based in Sweden, focused on backend systems, APIs, React applications, and practical AI automation.',
  skills: 'His portfolio lists React, Tailwind CSS, JavaScript, TypeScript, Node.js, Python, Java, C#, Dart, Flutter, Firebase, MongoDB, API development, Git, and machine learning with Python. This site also uses Supabase.',
  education: 'He studies Information Systems with a Data Science focus at Högskolan Dalarna. His listed coursework includes AI, Data Science & Machine Learning, Database Systems, web applications, responsive web design, and IT Project Management. He also completed CCNA: Introduction to Networks.',
  high_school: 'Abdiaziz attended Lugnetgymnasiet (Lugnet High School) in Sweden from August 2019 to June 2022. He completed the Electrical and Energy Program, specializing in Computer & Communication Technology, with a vocational diploma in computer and network technology.',
  university: 'Abdiaziz studies the Information Systems Programme at Dalarna University (Högskolan Dalarna), Sweden, with a Data Science focus. He started in August 2023 and is currently studying. His portfolio does not list a completed university degree.',
  diplomas: 'His completed qualifications include a vocational high school diploma from Lugnetgymnasiet in 2022: Electrical and Energy Program, Computer & Communication Technology. He also completed CCNA: Introduction to Networks through Cisco Networking Academy in 2024. His Information Systems university studies are ongoing; a completed university degree is not listed.',
  courses: 'At Dalarna University, his listed courses include Object-Oriented Programming, Data and Information Management, Database Systems, Dynamic Web Applications, Responsive Web Design, Artificial Intelligence, Data Science & Machine Learning, Statistical Analysis, Web-based GIS, and IT Project Management. At Lugnetgymnasiet, he studied Programming 1 & 2, Network Technology, Web Development, Web Server Programming, Computer Technology, Digital Communication Technology, security systems, and electronics.',
  cv: 'His CV describes a System Developer focused on backend systems, APIs, and AI-powered applications. It covers Information Systems studies at Dalarna University, his Lugnet high school education, technical skills, and independent software development. Download his CV: https://aziz.smartdo.app/cv/abdiaziz-nor-cv.pdf',
  experience: 'His CV lists independent software development from 2025 to present. He developed a workforce and shift-scheduling platform with messaging, subscriptions, and multilingual support; integrated backend services, APIs, databases, and authentication; and built task management, queue management, and workflow automation features. He worked across frontend, backend, and cloud deployment. No other employers or employment dates are listed in the CV.',
  projects: 'This portfolio uses React, Vite, Tailwind CSS, Supabase, and EmailJS. Its admin area manages projects, blog posts, and media uploads. You can explore his published projects in the Projects section.',
  services: 'His listed services include backend development, REST API design, React websites, database design, AI automation, system optimization, and cloud deployment support. Use the contact form to discuss a specific project.',
  automation: 'His AI automation focus includes workflow assistants, document summarization, support helpers, smart reporting, and API integrations that reduce repetitive work.',
  ml: 'His machine learning experience is connected to his Data Science studies, with Python-based data analysis and basic model-training practice.',
  databases: 'His portfolio lists Firebase and MongoDB among his skills. This site now uses Supabase for projects, blog posts, authentication, and media storage.',
  contact: 'Use the contact form on this site, LinkedIn, or WhatsApp from the homepage. You can review his code on GitHub: https://github.com/AbdiazizNor114. LinkedIn: https://www.linkedin.com/in/abdiaziiz-abdullahi-066a74232/.',
  availability: 'Please contact Abdiaziz directly about internships, developer roles, collaborations, or client projects. Current availability, pricing, and schedules are not confirmed in the portfolio.',
};
const patterns = [
  ['cv', /\b(cv|resume|résumé|curriculum vitae)\b/i],
  ['high_school', /\b(high\s*(?:school|shcool)|secondary school|lugnet(?:gymnasiet)?|gymnasium)\b/i],
  ['diplomas', /\b(finished (?:his |your |the )?studies)\b|\b(diplomas?|certificates?|certifications?|qualifications?|ccna|cisco|graduat(?:e|ed|ion)|degrees?)\b/i],
  ['university', /\b(university|college|dalarna|högskolan|hogskolan)\b/i],
  ['courses', /\b(courses?|coursework|subjects?|modules?)\b/i],
  ['experience', /\b(work experience|employment|employers?|career|worked|professional experience)\b/i],
  ['contact', /\b(get (?:in touch|hold of)|talk to|send (?:him|you) a message)\b|\b(contact|hire|reach|email|linkedin|whatsapp)\b/i],
  ['education', /\b(learn(?:ed)? all this|learn(?:ed)? to (?:code|program))\b|\b(education|stud(?:y|ies|ying)|school|university|college|course|ccna|degree)\b/i],
  ['availability', /\b(available|availability|internship|job|opportunity|freelance|price|pricing|schedule)\b/i],
  ['automation', /\b(automation|workflow|agent|summari[sz]er|chatbot)\b/i],
  ['ml', /\b(machine learning|ml|data science|ai experience)\b/i],
  ['databases', /\b(database|databases|supabase|firestore|firebase|mongodb|sql)\b/i],
  ['skills', /\b(good at|capable of|can (?:he|you) (?:use|work with)|know how to)\b|\b(skills?|stack|technolog(?:y|ies)|strongest|tools|languages?|react|python|javascript|typescript)\b/i],
  ['projects', /\b(apps?|applications?|work samples?|examples? of (?:his|your) work|show (?:his|your) work)\b|\b(projects?|portfolio|built|github|shaqonet|smartdo|bank)\b/i],
  ['services', /\b(can (?:he|you) (?:make|build|create)|for my (?:shop|company|business))\b|\b(services?|offers?|client|business|build for|help with)\b/i],
  ['intro', /\b(his story|based|live|located)\b|\b(background|introduce|abdiaziz|aziz|about (?:you|him)|who (?:is|are) (?:he|you|abdiaziz|aziz))\b/i],
];
export const INTRO_QUESTION = /^(?:who(?:'s| is| are) (?:this|that)(?: guy| man| person| developer)?|who(?:'s| is| are) (?:he|you)|(?:tell me|what can you tell me|can you tell me)(?: more)? about (?:him|yourself|this guy|this person)|what does (?:he|this guy) do)[?.!\s]*$/i;
const followUp = /^(?:tell me more|more|explain|details|go on|continue|what else|why|from where|where|source|how do you know)[?.!\s]*$/i;
export function routeLocally(question, conversation = [], projects = []) {
  if (/^(hi|hello|hey|good (morning|afternoon|evening))[!.\s]*$/i.test(question)) return { topic: 'intro' };
  if (/\b(wife|husband|girlfriend|boyfriend|children|birthday|salary|home address)\b|ignore.*instructions|system prompt|write (?:me )?(?:code|an essay)|solve|weather|recipe|capital of/i.test(question)) return { topic: 'unknown' };
  if (INTRO_QUESTION.test(question.trim())) return { topic: 'intro' };
  const projectDetail = /\b(source|code|repo|repository)\b/i.test(question) ? 'code' : /\b(try|demo|open|visit|live|link)\b/i.test(question) ? 'demo' : /\b(use(?:d)?|built with|build it|tech|stack)\b/i.test(question) ? 'tech' : 'summary';
  const project = projects.find(p => p.title && question.toLowerCase().includes(p.title.toLowerCase()));
  if (project) return { topic: 'projects', projectId: String(project.id), projectDetail };
  if (/\b(it|that app|that project|this app)\b/i.test(question)) {
    for (const message of [...conversation].reverse()) {
      if (message.sender !== 'user') continue;
      const previous = routeLocally(message.text, [], projects);
      if (previous.topic === 'projects') return { ...previous, projectDetail, detail: true };
    }
  }
  if (followUp.test(question)) {
    for (const message of [...conversation].reverse()) {
      if (message.sender === 'user' && !followUp.test(message.text)) {
        const route = routeLocally(message.text, [], projects);
        if (route.topic !== 'unknown') return { ...route, detail: true };
      }
    }
  }
  const topics = [...new Set(patterns.filter(([topic, pattern]) => topic !== 'intro' && pattern.test(question)).map(([topic]) => topic))];
  if (/\b(and|also|plus)\b/i.test(question) && topics.length > 1) return { topic: topics[0], topics: topics.slice(0, 4), projectDetail };
  return { topic: patterns.find(([, pattern]) => pattern.test(question))?.[0] || 'unknown', projectDetail };
}
export function answerFromFacts(route, projects = []) {
  if (route?.missing) return 'That detail is not listed in Abdiaziz’s portfolio or CV. Please contact him directly to confirm it.';
  if (route?.topics?.length > 1) return route.topics.map(topic => answerFromFacts({ ...route, topic, topics: undefined }, projects)).join('\n\n');
  if (!TOPICS.includes(route?.topic) || route.topic === 'unknown') return SCOPE_MESSAGE;
  if (route.topic === 'projects' && projects.length) {
    const project = projects.find(p => String(p.id) === route.projectId);
    if (project) {
      if (route.projectDetail === 'tech') return `${project.title} uses ${project.tech || 'technologies not listed in the portfolio'}.`;
      if (route.projectDetail === 'code') return project.github ? `Source code for ${project.title}: ${project.github}` : `A public source-code link for ${project.title} is not listed.`;
      if (route.projectDetail === 'demo') return project.demo ? `Try ${project.title}: ${project.demo}` : `A live demo for ${project.title} is not listed.`;
      const summary = String(project.desc || project.content || '').replace(/^#{1,6}\s*/gm, '').replace(/[*_`]/g, '').slice(0, route.detail ? 1800 : 1000);
      return `${project.title}\n\n${summary || 'Open this project in the Projects section for details.'}${project.tech ? '\n\nTech: ' + project.tech : ''}${project.github ? '\n\nCode: ' + project.github : ''}${project.demo ? '\nLive demo: ' + project.demo : ''}`;
    }
    if (route.detail || ['tech', 'code', 'demo'].includes(route.projectDetail)) return projects.map(p => answerFromFacts({ ...route, projectId: String(p.id) }, [p])).join('\n\n');
    return `Published projects include ${projects.map(p => p.title).filter(Boolean).join(', ')}. Open the Projects section for case studies, source code, and live demos.\n\n${FACTS.projects}`;
  }
  return FACTS[route.topic];
}
export function getPortfolioAnswer(question, conversation = [], projects = []) {
  return answerFromFacts(routeLocally(question, conversation, projects), projects);
}
