export type Project = {
  id: number;
  name: string;
  description: string;
};


export const projects: Project[] = [
  {
    id: 1,
    name: "Developer Dashboard",
    description: "A dashboard for tracking projects and developer activity.",
  },
  {
    id: 2,
    name: "Student Collaboration Platform",
    description: "A platform where students can collaborate on projects.",
  },
];