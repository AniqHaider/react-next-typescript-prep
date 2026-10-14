export type Topic = 'react' | 'next' | 'typescript';
export type Level = 'basic' | 'mid' | 'advanced';

export interface Question {
	id: string;
	topic: Topic;
	level: Level;
	/** Short subtopic label, e.g. "hooks", "caching", "generics". Shown as a chip. */
	tag: string;
	q: string;
	code?: string;
	/** The right answer is authored first; the UI shuffles options per attempt. */
	correct: string;
	wrong: [string, string, string];
	/** Self-contained explanation: why `correct` is right AND why the traps are wrong. */
	why: string;
}

/** Tiny authoring helper: ids are assigned by position so they stay stable as long as order is kept. */
export function builder(prefix: string, topic: Topic) {
	const out: Question[] = [];
	const add = (
		level: Level,
		tag: string,
		q: string,
		correct: string,
		wrong: [string, string, string],
		why: string,
		code?: string
	) => {
		out.push({ id: prefix + String(out.length + 1).padStart(2, '0'), topic, level, tag, q, code, correct, wrong, why });
	};
	return { out, add };
}
