import type { Level, Question, Topic } from './types';

export interface Config {
	topic: Topic | 'all';
	level: Level | 'all';
	mode: 'practice' | 'exam';
	count: number; // 0 = all
	onlyMissed: boolean;
}

/** A question with its options shuffled for this attempt. */
export interface Item {
	q: Question;
	options: string[];
	correctIndex: number;
}

export function shuffle<T>(arr: readonly T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

export function matches(q: Question, cfg: Config, missed: ReadonlySet<string>): boolean {
	return (
		(cfg.topic === 'all' || q.topic === cfg.topic) &&
		(cfg.level === 'all' || q.level === cfg.level) &&
		(!cfg.onlyMissed || missed.has(q.id))
	);
}

export function buildDeck(all: Question[], cfg: Config, missed: ReadonlySet<string>): Item[] {
	let pool = shuffle(all.filter((q) => matches(q, cfg, missed)));
	if (cfg.count > 0) pool = pool.slice(0, cfg.count);
	return pool.map((q) => {
		const options = shuffle([q.correct, ...q.wrong]);
		return { q, options, correctIndex: options.indexOf(q.correct) };
	});
}
