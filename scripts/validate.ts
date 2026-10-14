// Sanity-checks the question bank: counts, shape, duplicates, answer-letter leakage.
// `bun scripts/validate.ts`                       -> whole bank (src/lib/questions/index.ts)
// `bun scripts/validate.ts src/lib/questions/a.ts` -> just that file (every exported array of questions)
import { resolve } from 'node:path';
import type { Question } from '../src/lib/types';

const files = process.argv.slice(2);
let questions: Question[];
if (files.length) {
	questions = [];
	for (const f of files) {
		const mod = await import(resolve(f));
		for (const v of Object.values(mod)) if (Array.isArray(v)) questions.push(...(v as Question[]));
	}
} else {
	questions = (await import('../src/lib/questions/index')).questions;
}

const errors: string[] = [];
const ids = new Set<string>();
const texts = new Set<string>();
const TOPICS = ['react', 'next', 'typescript'];
const LEVELS = ['basic', 'mid', 'advanced'];

for (const q of questions) {
	if (ids.has(q.id)) errors.push(`${q.id}: duplicate id`);
	ids.add(q.id);
	const key = q.q.trim().toLowerCase();
	if (texts.has(key)) errors.push(`${q.id}: duplicate question text`);
	texts.add(key);
	if (!TOPICS.includes(q.topic)) errors.push(`${q.id}: bad topic ${q.topic}`);
	if (!LEVELS.includes(q.level)) errors.push(`${q.id}: bad level ${q.level}`);
	if (!q.tag?.trim()) errors.push(`${q.id}: missing tag`);
	if (!q.q.trim()) errors.push(`${q.id}: empty question`);
	const opts = [q.correct, ...q.wrong];
	if (opts.length !== 4 || new Set(opts).size !== 4) errors.push(`${q.id}: options must be 4 distinct strings`);
	if (opts.some((o) => !o.trim())) errors.push(`${q.id}: empty option`);
	if (/all of the above|none of the above|both a and b/i.test(opts.join('|'))) errors.push(`${q.id}: avoid "all/none of the above" (options are shuffled)`);
	if (q.why.length < 80) errors.push(`${q.id}: explanation too short (${q.why.length})`);
	if (/\b(option|answer|choice) [A-D]\b/i.test(q.why)) errors.push(`${q.id}: explanation refers to a letter, but options are shuffled`);
}

const by = (f: (q: Question) => string) =>
	questions.reduce<Record<string, number>>((m, q) => ((m[f(q)] = (m[f(q)] ?? 0) + 1), m), {});

const longest = questions.filter((q) => q.correct.length > Math.max(...q.wrong.map((w) => w.length))).length;
console.log('total', questions.length, '| by topic', by((q) => q.topic), '| by level', by((q) => q.level));
console.log(`correct is the longest option in ${longest}/${questions.length} (${Math.round((longest / questions.length) * 100)}%) — keep this under ~40% so length is not a giveaway`);
if (errors.length) {
	console.error('\n' + errors.join('\n'));
	process.exit(1);
}
console.log('OK');
