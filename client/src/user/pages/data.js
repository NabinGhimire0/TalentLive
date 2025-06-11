const user = {
  id: 1,
  name: "Alex Johnson",
  email: "alex@example.com",
  mmr: 1250,
  rank: "Gold III",
  profileImage: "/api/placeholder/100/100"
};

const mockSkills = [
  { id: 1, name: "React", category: "Frontend", verified: true, level: "Advanced", points: 85 },
  { id: 2, name: "Laravel", category: "Backend", verified: false, level: "Intermediate", points: 70 },
  { id: 3, name: "Hospitality Management", category: "Service", verified: true, level: "Expert", points: 95 },
  { id: 4, name: "UI/UX Design", category: "Design", verified: false, level: "Beginner", points: 45 }
];

const mockProjects = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Full-stack web application for online shopping",
    skills: ["React", "Laravel", "MySQL"],
    status: "Completed",
    mmrGained: 150,
    duration: "3 months",
    effectiveness: 4.5
  },
  {
    id: 2,
    title: "Hotel Management System",
    description: "Comprehensive system for hotel operations",
    skills: ["Hospitality Management", "React", "Node.js"],
    status: "In Progress",
    mmrGained: 0,
    duration: "2 months",
    effectiveness: 0
  }
];

const mockTutorials = [
  {
    id: 1,
    title: "Advanced React Patterns",
    skill: "React",
    duration: 120,
    watched: 80,
    instructor: "John Doe",
    mmrReward: 50,
    status: "In Progress"
  },
  {
    id: 2,
    title: "Laravel Best Practices",
    skill: "Laravel",
    duration: 90,
    watched: 90,
    instructor: "Jane Smith",
    mmrReward: 40,
    status: "Completed"
  },
  {
    id: 3,
    title: "Hotel Service Excellence",
    skill: "Hospitality Management",
    duration: 75,
    watched: 0,
    instructor: "Mike Wilson",
    mmrReward: 35,
    status: "Not Started"
  }
];

const mockInternships = [
  {
    id: 1,
    company: "Tech Innovations Inc.",
    position: "Frontend Developer Intern",
    duration: "6 months",
    status: "Completed",
    mmrGained: 200,
    skills: ["React", "JavaScript", "CSS"]
  },
  {
    id: 2,
    company: "Grand Hotel Chain",
    position: "Operations Intern",
    duration: "3 months",
    status: "Active",
    mmrGained: 0,
    skills: ["Hospitality Management", "Customer Service"]
  }
];
export default { user, mockSkills, mockProjects, mockTutorials, mockInternships };