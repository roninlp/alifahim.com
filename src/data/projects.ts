export type Project = {
	slug: string;
	index: string;
	title: string;
	tagline: string;
	summary: string;
	year: string;
	role: string;
	team: string;
	stack: string[];
	cover: string;
	alt: string;
	stats: { value: string; label: string }[];
	sections: { title: string; paragraphs: string[] }[];
	quote: string;
};

export const projects: Project[] = [
	{
		slug: 'ledger',
		index: '01',
		title: 'Ledger',
		tagline: 'A finance dashboard rebuilt around speed',
		summary:
			'A treasury tool for people who look at numbers all day, rebuilt so the interface keeps up with the way they think.',
		year: '2025',
		role: 'Lead frontend engineer',
		team: '2 designers, 4 engineers',
		stack: ['TypeScript', 'React', 'TanStack Query', 'WebSockets', 'Node', 'Postgres'],
		cover: '/covers/ledger.svg',
		alt: 'Abstract illustration of a finance dashboard with a large balance figure and a bar chart.',
		stats: [
			{ value: '8×', label: 'faster first interaction' },
			{ value: '61%', label: 'less JavaScript shipped' },
			{ value: '0', label: 'layout shifts on load' },
		],
		sections: [
			{
				title: 'The problem',
				paragraphs: [
					'Ledger had grown the way dashboards do: one chart at a time, each one reasonable on its own, until opening a tab meant waiting on forty requests to agree with each other. Analysts kept a spreadsheet open alongside it, not because the data was wrong, but because the interface made them wait for numbers they already knew.',
					'The brief was not a redesign. It was a question: what would it take for this to feel instant?',
				],
			},
			{
				title: 'The approach',
				paragraphs: [
					'We started by measuring where the time actually went. Most of it was not rendering: it was waterfall. Data that depended on other data, fetched in sequence, painted in batches. We restructured the query layer around the questions people asked rather than the shape of the API, then streamed the slow parts in behind a stable skeleton so the layout never jumped.',
					'Lists went virtual, mutations went optimistic, and every row got a keyboard path. The chart library went out and was replaced with hand-built SVG that we could animate on the compositor without blocking input.',
				],
			},
			{
				title: 'The outcome',
				paragraphs: [
					'First meaningful interaction dropped from 420ms to 48ms on a mid-range laptop, and the bundle got lighter on the way. The spreadsheet stayed open for about a week after launch, then quietly closed.',
					'What stuck with me was the shift in behaviour: people started clicking around to find out, instead of knowing exactly which tab they needed. Speed turned into curiosity.',
				],
			},
		],
		quote:
			'The interface stopped being something people waited on and started being something they thought with.',
	},
	{
		slug: 'harbor',
		index: '02',
		title: 'Harbor',
		tagline: 'A design system four teams actually adopted',
		summary:
			'Tokens, primitives and documentation built to make the good path the fast one, and to survive contact with four product teams.',
		year: '2024',
		role: 'Frontend engineer, systems',
		team: '1 designer, 2 engineers',
		stack: ['React', 'TypeScript', 'CSS', 'Radix', 'Storybook', 'Style Dictionary'],
		cover: '/covers/harbor.svg',
		alt: 'Abstract illustration of a component library: buttons, a toggle, a slider and a colour ramp.',
		stats: [
			{ value: '68', label: 'components, all documented' },
			{ value: '4', label: 'product teams on the same kit' },
			{ value: '30%', label: 'less UI code after migration' },
		],
		sections: [
			{
				title: 'The problem',
				paragraphs: [
					'Four teams, four button components, three definitions of a focus ring. Nothing was broken in isolation, but every feature paid a small tax in decisions nobody should have to make twice.',
					'A previous attempt had failed on adoption: the components were fine, the ergonomics were not. People reached for the local copy because it was closer.',
				],
			},
			{
				title: 'The approach',
				paragraphs: [
					'We treated adoption as the actual feature. Everything shipped as one package with typed props, sensible defaults, and no required configuration. If the default was not right for a case, that was a bug in the system, not a reason to fork.',
					'Tokens are the part people underestimate: colour, spacing, type and motion defined once, generated for CSS variables and native targets from the same source. The docs contain copy-paste examples with real states (loading, empty, error, disabled), because a component without its states is only half designed.',
				],
			},
			{
				title: 'The outcome',
				paragraphs: [
					'Adoption stuck this time. Migration happened in the background over two quarters, mostly driven by the teams themselves, and the duplicated UI code went down by about a third.',
					'The quieter win is consistency of detail: focus rings that match everywhere, motion that shares one curve, contrast that holds at 200% zoom.',
				],
			},
		],
		quote:
			'The design system is not the components. It is the number of decisions a team no longer has to make.',
	},
	{
		slug: 'tempo',
		index: '03',
		title: 'Tempo',
		tagline: 'Real-time editing that survives bad wifi',
		summary:
			'A collaborative document editor where presence, cursors and conflict resolution are felt only when they fail, which is to say, rarely.',
		year: '2024',
		role: 'Fullstack engineer',
		team: '3 engineers',
		stack: ['ProseMirror', 'WebSockets', 'Node', 'Postgres', 'Redis'],
		cover: '/covers/tempo.svg',
		alt: 'Abstract illustration of a document editor with a highlighted paragraph and two collaborator cursors.',
		stats: [
			{ value: '<40ms', label: 'local echo latency' },
			{ value: '99.98%', label: 'sessions without resync' },
			{ value: '12k', label: 'documents migrated' },
		],
		sections: [
			{
				title: 'The problem',
				paragraphs: [
					'Collaboration feels magical until the train goes through a tunnel. The existing editor handled the happy path well and fell apart everywhere else: duplicated paragraphs after a reconnect, cursors drifting, a save conflict that could silently drop an hour of writing.',
				],
			},
			{
				title: 'The approach',
				paragraphs: [
					'Edits apply locally first and reconcile in the background. The document model is deterministic, so a client that reconnects after ten minutes offline can replay its way back to consistency instead of asking the server who is right.',
					'On the server, a small Node service owns sessions and persistence, with Postgres as the source of truth and Redis for the ephemeral presence data that should never be durable. Everything has a test that simulates a nasty network before a human ever has to.',
				],
			},
			{
				title: 'The outcome',
				paragraphs: [
					'Resyncs dropped to near zero and support tickets about lost writing went away entirely. The editor now gets used on planes, which is the only benchmark that matters.',
				],
			},
		],
		quote:
			'Offline is not an edge case. It is Tuesday afternoon on the 16:40 to Utrecht.',
	},
	{
		slug: 'northwind',
		index: '04',
		title: 'Northwind',
		tagline: 'A storefront that loads before you blink',
		summary:
			'Static-first commerce, rendered at the edge, with a small Node service handling everything that actually needs a server.',
		year: '2023',
		role: 'Frontend engineer, fullstack',
		team: '2 engineers, 1 designer',
		stack: ['Astro', 'TypeScript', 'Node', 'Postgres', 'Stripe'],
		cover: '/covers/northwind.svg',
		alt: 'Abstract illustration of a storefront with a header bar and three product cards.',
		stats: [
			{ value: '0.4s', label: 'largest contentful paint' },
			{ value: '98', label: 'Lighthouse performance' },
			{ value: '+24%', label: 'mobile conversion' },
		],
		sections: [
			{
				title: 'The problem',
				paragraphs: [
					'A catalogue of 4,000 products on a storefront that shipped 900kB of JavaScript before showing a single price. Mobile users, most of the traffic, bounced before the hero image finished loading.',
				],
			},
			{
				title: 'The approach',
				paragraphs: [
					'The rule was simple: anything that can be computed at build time is. Pages are static, regenerated on inventory changes, and hydrated only where interaction demands it: filters, cart, checkout. The rest is HTML and CSS.',
					'The API stayed small and boring on purpose: one Node service, one Postgres database, Stripe for payments. Boring infrastructure is fast infrastructure.',
				],
			},
			{
				title: 'The outcome',
				paragraphs: [
					'Paint on a throttled 3G connection went from 3.1s to 0.4s and the JavaScript payload shrank to 46kB. Conversion on mobile moved 24% in the first quarter, with no change to prices or marketing spend.',
				],
			},
		],
		quote: 'Performance is a design decision that happens to be measured in milliseconds.',
	},
];

export type Role = {
	period: string;
	title: string;
	company: string;
	note: string;
	points: string[];
};

export const roles: Role[] = [
	{
		period: 'Oct 2024 to now',
		title: 'Senior Frontend Developer',
		company: 'Yadak',
		note: 'Search, chat and the type-safe API layer behind a large car marketplace.',
		points: [
			'Led the Next.js 14 to 15.5/16 upgrade into a modular, high-performance architecture, cutting load times by around 40%.',
			'Built interactive chatbot features on advanced AI models.',
			'Type-safe APIs with tRPC across frontend and backend, reducing integration errors by about 60%.',
			'Designed and optimised full-text search with Elasticsearch, improving search relevance to 95%.',
			'Established the shadcn/ui foundation on top of a custom design system.',
			'Observability through OpenTelemetry with the Grafana stack (Loki, Tempo, Prometheus).',
		],
	},
	{
		period: 'Sep 2022 to Sep 2024',
		title: 'Frontend Developer',
		company: 'Arka',
		note: 'Legacy React modernised, and the tooling that made the team faster.',
		points: [
			'Overhauled 1000s of lines of legacy React, moving Redux to RTK for better performance and UX.',
			'Led the company-wide migration from TFVC to Git.',
			'Architected and implemented CI/CD pipelines for 4 React projects on Azure DevOps.',
			'Pioneered the adoption of Vite in legacy React codebases, speeding up dev environments and builds.',
			'Built multi-step, interconnected validations for Excel files with Zod.',
		],
	},
	{
		period: 'Jan 2022 to Sep 2022',
		title: 'Fullstack Developer',
		company: 'Tali (freelance)',
		note: 'A personal project and freelance work: a full-stack project management app, built end to end.',
		points: [
			'Architected and deployed the app with Next.js and Tailwind CSS, built around my own workflow.',
			'End-to-end type-safe endpoints with Drizzle ORM, tRPC and React Query.',
			'Form components with React Hook Form and Zod, plus Zustand for global state.',
		],
	},
];

/* Homepage "selected work": drawn from the résumé's real roles rather than
   the fictional case studies, which still live in `projects` for /work/*. */
export type WorkItem = {
	index: string;
	company: string;
	role: string;
	period: string;
	year: string;
	summary: string;
	stack: string[];
	result: { value: string; label: string };
};

export const work: WorkItem[] = [
	{
		index: '01',
		company: 'Yadak',
		role: 'Senior Frontend Developer',
		period: 'Oct 2024 to present',
		year: '2024',
		summary:
			'Search, chat and the API layer for a large car marketplace: Next.js on the front, tRPC and Elasticsearch behind it.',
		stack: ['Next.js', 'TypeScript', 'tRPC', 'Elasticsearch'],
		result: { value: '−40%', label: 'load times after the Next.js 15/16 rebuild' },
	},
	{
		index: '02',
		company: 'Arka',
		role: 'Frontend Developer',
		period: 'Sep 2022 to Sep 2024',
		year: '2022',
		summary:
			'Legacy React brought up to date: Redux → RTK, Vite in place of Webpack, and CI/CD the whole team could trust.',
		stack: ['React', 'TypeScript', 'RTK', 'Vite', 'Azure DevOps'],
		result: { value: '1000s', label: 'of lines of legacy React rewritten' },
	},
	{
		index: '03',
		company: 'Tali',
		role: 'Fullstack Developer (freelance)',
		period: 'Jan 2022 to Sep 2022',
		year: '2022',
		summary:
			'A full-stack project management app: Next.js, Drizzle and tRPC, with forms that validate the way people actually fill them in.',
		stack: ['Next.js', 'tRPC', 'Drizzle', 'PostgreSQL', 'Tailwind CSS'],
		result: { value: 'E2E', label: 'type safety, database to UI' },
	},
];
