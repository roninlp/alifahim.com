export type Role = {
	id: string;
	period: string;
	title: string;
	company: string;
	note: string;
	points: string[];
};

export const roles: Role[] = [
	{
		id: 'yadak',
		period: 'Oct 2024 to present',
		title: 'Senior Frontend Developer',
		company: 'Yadak',
		note: 'Search across a large car database, chatbot features and the type-safe API layer.',
		points: [
			'Led the Next.js 14 to 15.5/16 upgrade into a modular, high-performance architecture, cutting load times by around 40%.',
			'Built interactive chatbot features using advanced AI models.',
			'Implemented type-safe APIs with tRPC, reducing errors by 60%.',
			'Designed and optimized full-text search with Elasticsearch, improving search relevance to 95%.',
			'Established a shadcn/ui foundation based on a custom design system.',
			'Added observability with OpenTelemetry and the Grafana stack (Loki, Tempo, Prometheus).',
		],
	},
	{
		id: 'arka',
		period: 'Sep 2022 to Sep 2024',
		title: 'Frontend Developer',
		company: 'Arka',
		note: 'Legacy React modernized, and the tooling that made the team faster.',
		points: [
			'Overhauled thousands of lines of legacy React, moving Redux to RTK to improve performance and UX.',
			'Led the company-wide migration from TFVC to Git.',
			'Built CI/CD pipelines for four React projects using Azure DevOps.',
			'Introduced Vite in legacy React codebases, accelerating development and build steps.',
			'Built multi-step, interconnected Excel validations with Zod.',
		],
	},
	{
		id: 'tali',
		period: 'Jan 2022 to Sep 2022',
		title: 'Fullstack Developer',
		company: 'Tali · personal project and freelance',
		note: 'A full-stack project management application built around my workflow.',
		points: [
			'Architected and deployed the app with Next.js and Tailwind CSS.',
			'Built end-to-end type-safe endpoints with Drizzle ORM, tRPC and React Query.',
			'Created form components with React Hook Form and Zod, plus Zustand for global state.',
		],
	},
];

export type WorkItem = {
	id: Role['id'];
	index: string;
	company: string;
	role: string;
	period: string;
	description: string;
};

/* Homepage career highlights, drawn from the résumé's real roles. */
export const work: WorkItem[] = [
	{
		id: 'yadak',
		index: '01',
		company: 'Yadak',
		role: 'Senior Frontend Developer',
		period: 'Oct 2024 to present',
		description:
			'Upgraded Next.js 14 to 15.5/16 (~40% faster loads), built AI chatbot features and tRPC APIs, and improved Elasticsearch search relevance to 95%.',
	},
	{
		id: 'arka',
		index: '02',
		company: 'Arka',
		role: 'Frontend Developer',
		period: 'Sep 2022 to Sep 2024',
		description:
			'Modernized legacy React with RTK and Vite, led the TFVC-to-Git migration, and built CI/CD for four React projects.',
	},
	{
		id: 'tali',
		index: '03',
		company: 'Tali',
		role: 'Fullstack Developer · freelance',
		period: 'Jan 2022 to Sep 2022',
		description:
			'Built a project-management app with Next.js and Tailwind, type-safe Drizzle/tRPC APIs, and React Hook Form/Zod validations.',
	},
];
