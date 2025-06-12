import { Award, BarChart3, BookOpen, Briefcase, PieChart, Settings, Star, TrendingUp, User, Users } from "lucide-react";

const mockUserData = {
  name: "Alex Johnson",
  email: "alex.johnson@email.com",
  mmr: 1847,
  rank: "Gold",
  level: 12,
  skills: [
    { id: 1, name: "React", level: "Advanced", verified: true, points: 450 },
    { id: 2, name: "Node.js", level: "Intermediate", verified: true, points: 320 },
    { id: 3, name: "Hospitality", level: "Expert", verified: false, points: 280 },
    { id: 4, name: "Laravel", level: "Beginner", verified: false, points: 150 }
  ],
  projects: [
    { id: 1, name: "E-commerce Platform", skills: ["React", "Node.js"], mmr: 150, status: "Completed" },
    { id: 2, name: "Hotel Management System", skills: ["Laravel", "Hospitality"], mmr: 120, status: "In Progress" }
  ],
  tutorials: [
    { id: 1, name: "Advanced React Patterns", progress: 75, duration: 240, mmr: 50 },
    { id: 2, name: "Laravel Fundamentals", progress: 30, duration: 180, mmr: 25 }
  ],
  internships: [
    { id: 1, company: "TechCorp", role: "Frontend Developer", status: "Active", mmr: 200 }
  ]
};

const mockMentorData = {
  name: "Dr. Sarah Wilson",
  email: "sarah.wilson@mentor.com",
  totalStudents: 47,
  totalTutorials: 23,
  skillsVerified: 156,
  students: [
    { id: 1, name: "Alex Johnson", mmr: 1847, progress: 75, lastActive: "2 hours ago" },
    { id: 2, name: "Emma Davis", mmr: 1523, progress: 60, lastActive: "1 day ago" },
    { id: 3, name: "Michael Chen", mmr: 2105, progress: 90, lastActive: "30 min ago" }
  ],
  tutorials: [
    { id: 1, title: "Advanced React Patterns", views: 234, rating: 4.8, status: "Published" },
    { id: 2, title: "Laravel Best Practices", views: 189, rating: 4.6, status: "Draft" }
  ],
  skillRequests: [
    { id: 1, student: "Alex Johnson", skill: "Hospitality", level: "Expert", submitted: "2 hours ago" },
    { id: 2, student: "Emma Davis", skill: "Vue.js", level: "Intermediate", submitted: "1 day ago" }
  ]
};
 const userMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'skills', label: 'Skills', icon: Star },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
    { id: 'internships', label: 'Internships', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const mentorMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'tutorials', label: 'Tutorials', icon: BookOpen },
    { id: 'verification', label: 'Skill Verification', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];
const menuItems =  mentorMenuItems ;

export default { mockUserData, mockMentorData, menuItems };