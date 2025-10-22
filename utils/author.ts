export interface Author {
  name: string;
  bio: string;
  shortBio: string;
  avatar?: string;
  website?: string;
  email?: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    youtube?: string;
    medium?: string;
    dev?: string;
    stackoverflow?: string;
    reddit?: string;
    discord?: string;
  };
  credentials: {
    title?: string;
    company?: string;
    experience?: string;
    education?: string[];
    certifications?: string[];
    achievements?: string[];
  };
  expertise: string[];
  location?: string;
  joinDate?: string;
}

export const authorData: Author = {
  name: "Unfiltered Mind",
  bio: "I'm a passionate developer and writer who believes in speaking truth without filters. With over 8 years of experience in software development and a deep understanding of technology's impact on society, I write about the intersection of code, culture, and critical thinking. My work spans from technical tutorials to social commentary, always with an emphasis on authenticity and unfiltered perspectives.",
  shortBio: "Developer, writer, and truth-seeker sharing unfiltered perspectives on technology and society.",
  avatar: "https://ui-avatars.com/api/?name=Unfiltered+Mind&background=000000&color=ffffff&size=200&bold=true", // Placeholder avatar
  website: "https://unfilteredmind.dev",
  email: "hello@unfilteredmind.dev",
  social: {
    twitter: "https://twitter.com/unfilteredmind",
    linkedin: "https://linkedin.com/in/unfilteredmind",
    github: "https://github.com/unfilteredmind",
    instagram: "https://instagram.com/unfilteredmind",
    youtube: "https://youtube.com/@unfilteredmind",
    medium: "https://medium.com/@unfilteredmind",
    dev: "https://dev.to/unfilteredmind",
    stackoverflow: "https://stackoverflow.com/users/unfilteredmind",
    reddit: "https://reddit.com/user/unfilteredmind",
    discord: "https://discord.gg/unfilteredmind"
  },
  credentials: {
    title: "Senior Software Developer & Technical Writer",
    company: "Independent",
    experience: "8+ years in software development",
    education: [
      "Computer Science Degree",
      "Certified AWS Solutions Architect",
      "Google Cloud Professional Developer"
    ],
    certifications: [
      "AWS Solutions Architect Associate",
      "Google Cloud Professional Developer",
      "Certified Kubernetes Administrator"
    ],
    achievements: [
      "Published 100+ technical articles",
      "Open source contributor to major projects",
      "Speaker at 5+ tech conferences",
      "Mentored 50+ junior developers"
    ]
  },
  expertise: [
    "JavaScript/TypeScript",
    "React/Next.js",
    "Node.js",
    "Python",
    "AWS/Cloud Architecture",
    "DevOps",
    "Technical Writing",
    "Open Source Development",
    "System Design",
    "Machine Learning"
  ],
  location: "San Francisco, CA",
  joinDate: "2020"
};

export function getAuthorData(): Author {
  return authorData;
}

export function getAuthorSocialLinks(): Author['social'] {
  return authorData.social;
}

export function getAuthorCredentials(): Author['credentials'] {
  return authorData.credentials;
}

export function getAuthorExpertise(): string[] {
  return authorData.expertise;
}
