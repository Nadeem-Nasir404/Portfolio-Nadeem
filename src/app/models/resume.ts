export interface Resume {
  name: string;
  title: string;
  location?: string;
  photo?: string; // path under assets or full URL
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary?: string;
  skills?: string[];
  tools?: string[];
  experience?: Experience[];
  projects?: Project[];
  education?: Education[];
}

export interface Experience {
  company: string;
  role: string;
  start: string; // e.g. 'Jan 2022'
  end: string;   // e.g. 'Present' or 'Dec 2024'
  location?: string;
  highlights?: string[];
  technologies?: string[];
}

export interface Project {
  name: string;
  description?: string;
  url?: string;
  repo?: string;
  highlights?: string[];
  technologies?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  start?: string;
  end?: string;
  location?: string;
  highlights?: string[];
}
