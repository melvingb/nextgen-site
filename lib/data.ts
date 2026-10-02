export type Design = {
  slug: string; title: string; description: string; image: string; tags: string[];
  repo: string; demoStyle: string; features: string[]; details: string;
};

export const designs: Design[] = [
  {slug:"cynthia",title:"Cynthia",description:"Black phpBB style with blue and red tones.",image:"/assets/images/Cynthia.jpg",tags:["dark","responsive","phpBB"],repo:"nextgen-solutions-gt/Cynthia",demoStyle:"Cynthia",features:["Responsive layout","Performance-focused","phpBB 3.3 compatible","Dark visual system"],details:"A dark phpBB style built around strong blue and red accents while keeping navigation and forum content easy to scan."},
  {slug:"fi-subice",title:"FI-Subice",description:"A modern update of the classic FI Subice style, based on prosilver.",image:"/assets/images/FI-Subice.jpg",tags:["responsive","phpBB"],repo:"nextgen-solutions-gt/FI-Subice",demoStyle:"fi_subice",features:["Responsive layout","ProSilver foundation","Performance-focused","phpBB 3.3 compatible"],details:"A refreshed version of the classic FI Subice design, rebuilt for current phpBB versions while retaining its familiar identity."},
  {slug:"saphic",title:"Saphic",description:"Soft silver tones combined with bright green accents.",image:"/assets/images/Saphic.jpg",tags:["responsive","phpBB"],repo:"nextgen-solutions-gt/saphic",demoStyle:"saphic",features:["Responsive layout","Clean visual hierarchy","Performance-focused","phpBB 3.3 compatible"],details:"A familiar silver-toned phpBB theme with bright green highlights and a lightweight visual feel."},
  {slug:"adinfinitum",title:"Adinfinitum",description:"Simple dark and red phpBB theme with easy header customization.",image:"/assets/images/adinfinitum.jpg",tags:["dark","responsive","phpBB"],repo:"nextgen-solutions-gt/adinfinitum",demoStyle:"adinfinitum",features:["Responsive layout","Customizable header","Light variants available","phpBB 3.3 compatible"],details:"A dark red style designed to be easy to personalize. The header imagery can be replaced quickly, with lighter variants available as well."},
  {slug:"milky-way",title:"Milky Way",description:"White-background phpBB theme with a clean page layout.",image:"/assets/images/milky_way.jpg",tags:["light","responsive","phpBB"],repo:"nextgen-solutions-gt/milky_way",demoStyle:"milky_way",features:["Responsive layout","Clean white interface","Performance-focused","phpBB 3.3 compatible"],details:"A straightforward light theme for communities that want a clean, readable forum experience."},
  {slug:"proglass",title:"Proglass",description:"A semi-fluid phpBB style with a blue glass design.",image:"/assets/images/proglass.jpg",tags:["responsive","phpBB"],repo:"nextgen-solutions-gt/proglass",demoStyle:"proglass",features:["Semi-fluid layout","Responsive behavior","Adjustable width","phpBB 3.3 compatible"],details:"Redesigned for phpBB 3.3 to remove legacy fixed-width limitations while preserving the original blue glass character."},
  {slug:"revolution",title:"Revolution",description:"Bold black and red phpBB style.",image:"/assets/images/revolution.jpg",tags:["dark","responsive","phpBB"],repo:"nextgen-solutions-gt/revolution",demoStyle:"revolution",features:["Responsive layout","High-contrast visual style","Performance-focused","phpBB 3.3 compatible"],details:"A strong black and red look for communities that want a more aggressive visual identity."},
  {slug:"we-clearblue",title:"we_clearblue",description:"Modern pastel phpBB style with integrated slider and social footer.",image:"/assets/images/we_clearblue.jpg",tags:["light","responsive","phpBB"],repo:"nextgen-solutions-gt/we_clearblue",demoStyle:"we_clearblue",features:["Responsive layout","HTML5/CSS3 foundation","Integrated image slider","phpBB 3.3 compatible"],details:"A light modern style using pastel tones, responsive patterns and built-in social presentation features."},
  {slug:"we-universal",title:"we_universal",description:"Modern, clean and flexible responsive style for phpBB 3.3.",image:"/assets/images/we_universal.jpg",tags:["responsive","phpBB"],repo:"nextgen-solutions-gt/we_universal",demoStyle:"we_universal",features:["Responsive layout","Easy custom.css configuration","Extension-friendly","phpBB 3.3 compatible"],details:"A flexible general-purpose phpBB style designed for many community types, with easy visual customization and strong extension compatibility."}
];

export const extension = {
  slug:"phpbb-directory", title:"phpBB Directory", description:"A modern, searchable directory extension for phpBB forums.",
  image:"/assets/images/extensions/phpbb-directory/cover.png", platform:"phpBB", status:"Release candidate", version:"2.0.0-RC4",
  repo:"nextgen-solutions-gt/ext-phpbb-directory", repoUrl:"https://github.com/nextgen-solutions-gt/ext-phpbb-directory",
  download:"https://github.com/nextgen-solutions-gt/ext-phpbb-directory/releases",
  features:["Categories and subcategories","SEO-friendly URLs","Permissions system","Responsive layout","ACP management"],
  screenshots:["information.png","general.png","category.png","authorization.png","add_edit.png","ajax_comments.png"]
};

export const portfolio = [
  {name:"Alicante Liberal",description:"Forum modernization and technical work for a Spanish community, including platform customization and responsive presentation.",image:"/assets/images/portfolio/alicanteliberal.png"},
  {name:"Foro Apuestas",description:"Forum implementation and customization for a sports-betting community with emphasis on usability and maintainability.",image:"/assets/images/portfolio/foroapuestas.png"}
];

export const testimonials = [
  {name:"Lubricidad Hernandez",role:"Forum Administrator",platform:"phpBB",rating:5,text:"Everything was great. All the requested changes were completed and communication was fast and clear."},
  {name:"mickey3",role:"Forum Administrator",platform:"phpBB",rating:5,text:"Excellent work selecting the theme and improving on-page SEO. Very attentive to every requested change."},
  {name:"nyko513",role:"Forum Administrator",platform:"phpBB",rating:5,text:"Excellent work, friendly and committed, with great attention to detail."},
  {name:"ccapit",role:"Forum Administrator",platform:"phpBB",rating:5,text:"Excellent service, always available to help, patient, knowledgeable and ahead of the agreed delivery time."},
  {name:"javitopo",role:"Forum Administrator",platform:"phpBB",rating:5,text:"Very happy with the work. An expert at customizing phpBB templates."},
  {name:"juanky75",role:"Forum Administrator",platform:"phpBB",rating:5,text:"Installation and configuration delivered very quickly after I had struggled with several errors. Totally satisfied."},
  {name:"dhormigo",role:"Forum Administrator",platform:"phpBB",rating:5,text:"Recommended service. It helped me a lot."},
  {name:"Filot",role:"Forum Administrator",platform:"phpBB",rating:5,text:"10/10. Excellent and fast."},
  {name:"dhormigo",role:"Community Owner",platform:"XenForo",rating:5,text:"Highly recommended if you have a forum hosted with XenForo."}
];

export const services = [
  {slug:"phpbb",title:"phpBB services",summary:"Upgrades, migrations, styles, extensions, troubleshooting and long-term phpBB support."},
  {slug:"xenforo",title:"XenForo services",summary:"Migration assistance, configuration, maintenance and targeted customization for XenForo communities."},
  {slug:"vbulletin",title:"vBulletin services",summary:"Maintenance, migrations and modernization work for established vBulletin communities."},
  {slug:"migrations",title:"Forum migrations",summary:"Careful migrations between major forum platforms with emphasis on data integrity and continuity."},
  {slug:"custom-development",title:"Custom development",summary:"Purpose-built themes, extensions, integrations and performance work for forum communities."}
];
