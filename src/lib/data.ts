/* Single source of content. Every value below comes from the résumé (Bharadwaj_Azure_Resume_1133.pdf).
   The résumé has no projects, no GitHub/LinkedIn links and no location, so those are absent on purpose. */

export type Role = { company: string; client?: string; start: string; end: string; points: string[] };

export const PROFILE = {
  name: "Bharadwaj Pasumarthi",
  first: "Bharadwaj",
  initials: "BP",
  role: "Azure Infrastructure Engineer",
  email: "bharadwajsaipasumarthi@gmail.com",
  phone: "9182243816",
  phoneHref: "tel:9182243816",
  resumeSummary:
    "Working as Azure Infrastructure Engineer with 5 years of experience in designing, deploying, and supporting Microsoft Azure infrastructure across enterprise environments. Hands-on expertise in Azure Virtual Machines, App Services, Storage Accounts, Azure Networking (VNets, NSGs, Load Balancers, VPN, ExpressRoute), Microsoft Entra ID (Azure AD), RBAC, Azure Monitor, Log Analytics, Application Insights. Experienced in Infrastructure as Code using Terraform and PowerShell automation, with exposure to Azure DevOps CI/CD pipelines. Strong troubleshooting, cloud operations, performance optimization, security, and governance experience.",
  extraLine: "Created operational documentation, SOPs, deployment procedures, and cloud governance documentation.",
  quote: "Cloud operations, troubleshooting and governance, across production environments.",
  years: "5 years",
  github: undefined as string | undefined,
  linkedin: undefined as string | undefined,
  resume: "/Bharadwaj_Pasumarthi_Resume.pdf",
};

export const NAV = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

export type Skill = { name: string; match: string[] };
export type SkillGroup = { family: string; skills: Skill[] };

const s = (name: string, ...match: string[]): Skill => ({ name, match: match.length ? match : [name] });

export const SKILL_GROUPS: SkillGroup[] = [
  { family: "Networking", skills: [
    s("Virtual Networks", "VNets", "Virtual Networks"), s("VNet Peering"), s("NSGs", "NSGs", "Network Security Groups"),
    s("UDRs", "UDRs"), s("VNet Gateway", "VPN Gateway"), s("Point-to-Site VPN", "Point-to-Site", "Point-to-Site and Site-to-Site"),
    s("Site-to-Site VPN", "Site-to-Site", "Site-toSite"), s("ExpressRoute"),
  ] },
  { family: "Security", skills: [
    s("Azure Firewall"), s("WAF", "WAF", "Web Application Firewall"), s("DDoS Protection", "DDoS"),
    s("Azure DNS"), s("Private Link"), s("Private Endpoints"),
  ] },
  { family: "Traffic & Delivery", skills: [
    s("Azure Front Door"), s("Azure CDN", "CDN"), s("Traffic Manager"), s("Application Gateway"),
  ] },
  { family: "Compute & Migration", skills: [
    s("Virtual Machines"), s("Azure Migrate"), s("Site Recovery"), s("Azure Backup"),
    s("Virtual Desktop", "virtual desktops"), s("Host Pools", "host pools"),
  ] },
  { family: "Web & Storage", skills: [
    s("App Services"), s("Storage Accounts"), s("Managed Disks"), s("Azure Files", "Files"), s("Blob"),
  ] },
  { family: "Identity & Access", skills: [
    s("Entra ID", "Entra ID"), s("RBAC"), s("Azure Policy"),
  ] },
  { family: "Scripting & Tools", skills: [s("PowerShell"), s("Terraform")] },
  { family: "Monitoring & DevOps", skills: [
    s("Azure Monitor"), s("Log Analytics"), s("Application Insights"), s("Azure DevOps"),
  ] },
];

export const EXPERIENCE: Role[] = [
  {
    company: "LTI Mindtree", client: "Client: Microsoft", start: "Jan 2022", end: "Jan 2025",
    points: [
      "Provided Azure infrastructure support for Microsoft clients, resolving complex cloud infrastructure issues for 50+ global enterprise customers while maintaining high service availability and customer satisfaction.",
      "Diagnosed and resolved Azure platform incidents using Azure Monitor, Log Analytics, Application Insights, Activity Logs, and diagnostic logs, minimizing downtime through effective root cause analysis.",
      "Supported hybrid connectivity by troubleshooting VPN Gateway, ExpressRoute, and App Service VNet Integration issues between on-premises and Azure environments.",
    ],
  },
  {
    company: "Cloud4C", start: "Feb 2025", end: "Dec 2025",
    points: [
      "Architected and implemented end-to-end Azure infrastructure solutions for 50+ enterprise clients, ensuring high availability, scalability, security, and performance.",
      "Conducted Azure Well-Architected Framework Reviews covering workload optimization, security, operational excellence, reliability, performance efficiency, and cost optimization.",
      "Implemented cost optimization with Azure Reserved Instances, autoscaling, resource rightsizing, and storage lifecycle management.",
    ],
  },
  {
    company: "Value Momentum Software Services", start: "Dec 2025", end: "Present",
    points: [
      "Managed Azure Virtual Machines, App Services, Storage Accounts, Load Balancers, Virtual Networks, and Network Security Groups across production environments.",
      "Provisioned and maintained Azure resources using Terraform and PowerShell to standardize deployments and improve infrastructure consistency.",
      "Supported Azure DevOps CI/CD deployments with development teams, and managed Microsoft Entra ID users, groups, Managed Identities, and RBAC under least-privilege principles.",
    ],
  },
];

export const EDUCATION = [
  {
    title: "Bachelor of Technology (ECE)",
    place: "Sai Spurthi Institute of Technology, B.Gangaram",
    detail: "Affiliated to JNTUH",
    start: "2017", end: "2021",
  },
];

export const CERTIFICATIONS = [
  { title: "Azure Administrator (AZ-104)", issuer: "Microsoft Certified" },
  { title: "Azure Fundamentals (AZ-900)", issuer: "Microsoft Certified" },
  { title: "Associate Cloud Engineer", issuer: "Google Certified" },
  { title: "Professional Cloud Architect", issuer: "Google Certified" },
];

export const ACHIEVEMENTS = [
  { label: "Best Employee", caption: "Appreciated with the Best Employee award", detail: "Quarters of September and January" },
  { label: "Best Team Player", caption: "Awarded the Best Team Player award", detail: "Previous month" },
  { label: "Best Employee, SDM", caption: "Awarded the Best Employee award by the SDM", detail: "October" },
];

/** Roles whose bullets mention a skill. Derived from the text above, never typed by hand. */
export function usedAt(skill: Skill): string[] {
  return EXPERIENCE.filter((r) => {
    const hay = r.points.join(" ").toLowerCase();
    return skill.match.some((m) => hay.includes(m.toLowerCase()));
  }).map((r) => r.company);
}
