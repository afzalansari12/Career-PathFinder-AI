export function parseResume(text: string) {
    return {
      hasEmail: /\S+@\S+\.\S+/.test(text),
  
      hasPhone: /\d{10}/.test(text),
  
      skills: [],
  
      projects: [],
  
      education: [],
  
      experience: []
    };
  }