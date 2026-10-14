import { useEffect, useMemo, useReducer, useState } from 'react';
import { questions } from './lib/questions';
import { buildDeck, matches, type Config, type Item } from './lib/quiz';
import { loadMissed, saveMissed } from './lib/storage';
import type { Level, Topic } from './lib/types';
import { Rich } from './Rich';

type Screen = 'home' | 'quiz' | 'result';

const LETTERS = ['A', 'B', 'C', 'D'];
const TOPICS: [Config['topic'], string][] = [['all', 'All'], ['react', 'React'], ['next', 'Next.js'], ['typescript', 'TypeScript']];
const LEVELS: [Config['level'], string][] = [['all', 'All'], ['basic', 'Basic'], ['mid', 'Mid'], ['advanced', 'Advanced']];
const TOPIC_LABEL: Record<Topic, string> = { react: 'React', next: 'Next.js', typescript: 'TypeScript' };
const TOPIC_COLOR: Record<Topic, string> = { react: 'var(--react)', next: 'var(--next)', typescript: 'var(--ts)' };
const LEVEL_LABEL: Record<Level, string> = { basic: 'Basic', mid: 'Mid', advanced: 'Advanced' };

const DEFAULT_CFG: Config = { topic: 'all', level: 'all', mode: 'practice', count: 10, onlyMissed: false };

interface Run {
	deck: Item[];
	i: number;
	picks: (number | null)[];
}
type RunAction =
	| { type: 'start'; deck: Item[] }
	| { type: 'pick'; n: number; locked: boolean }
	| { type: 'go'; i: number };

function runReducer(s: Run, a: RunAction): Run {
	switch (a.type) {
		case 'start':
			return { deck: a.deck, i: 0, picks: a.deck.map(() => null) };
		case 'pick': {
			if (a.locked) return s; // practice mode locks after the first pick
			const picks = [...s.picks];
			picks[s.i] = a.n;
			return { ...s, picks };
		}
		case 'go':
			return { ...s, i: a.i };
	}
}

export function App() {
	const [screen, setScreen] = useState<Screen>('home');
	const [cfg, setCfg] = useState<Config>(DEFAULT_CFG);
	const [missed, setMissed] = useState(loadMissed);
	const [run, dispatch] = useReducer(runReducer, { deck: [], i: 0, picks: [] });

	const { deck, i, picks } = run;
	const cur = deck[i];
	const pick = picks[i] ?? null;
	const revealed = cfg.mode === 'practice' && pick !== null;
	const score = deck.filter((d, n) => picks[n] === d.correctIndex).length;
	const poolSize = useMemo(() => questions.filter((q) => matches(q, cfg, missed)).length, [cfg, missed]);
	const patch = (p: Partial<Config>) => setCfg((c) => ({ ...c, ...p }));

	function start(over?: Partial<Config>) {
		const c = { ...cfg, ...over };
		const d = buildDeck(questions, c, missed);
		if (!d.length) return;
		setCfg(c);
		dispatch({ type: 'start', deck: d });
		setScreen('quiz');
	}

	function finish() {
		const m = new Set(missed);
		deck.forEach((d, n) => {
			if (picks[n] === d.correctIndex) m.delete(d.q.id);
			else m.add(d.q.id);
		});
		setMissed(m);
		saveMissed(m);
		setScreen('result');
	}

	function next() {
		if (pick === null) return;
		if (i < deck.length - 1) dispatch({ type: 'go', i: i + 1 });
		else finish();
	}

	useEffect(() => {
		if (screen !== 'quiz') return;
		const onKey = (e: KeyboardEvent) => {
			if (['1', '2', '3', '4'].includes(e.key)) dispatch({ type: 'pick', n: Number(e.key) - 1, locked: revealed });
			else if (e.key === 'Enter' || e.key === 'ArrowRight') next();
			else if (e.key === 'ArrowLeft' && cfg.mode === 'exam' && i > 0) dispatch({ type: 'go', i: i - 1 });
		};
		window.addEventListener('keydown', onKey);
		return () => window.removeEventListener('keydown', onKey);
	});

	return (
		<main>
			{screen === 'home' && (
				<>
					<header>
						<h1>react-next-typescript-prep</h1>
						<p className="muted">
							{questions.length} multiple-choice questions · every answer explains <em>why</em> · React 19, Next.js 15/16 App Router, TypeScript
						</p>
					</header>
					<section className="panel">
						<div className="row">
							<span className="lbl">Topic</span>
							{TOPICS.map(([v, l]) => (
								<button key={v} className={'chip' + (cfg.topic === v ? ' on' : '')} onClick={() => patch({ topic: v })}>
									{l}
								</button>
							))}
						</div>
						<div className="row">
							<span className="lbl">Level</span>
							{LEVELS.map(([v, l]) => (
								<button key={v} className={'chip' + (cfg.level === v ? ' on' : '')} onClick={() => patch({ level: v })}>
									{l}
								</button>
							))}
						</div>
						<div className="row">
							<span className="lbl">Mode</span>
							<button className={'chip' + (cfg.mode === 'practice' ? ' on' : '')} onClick={() => patch({ mode: 'practice' })}>
								Practice (explain instantly)
							</button>
							<button className={'chip' + (cfg.mode === 'exam' ? ' on' : '')} onClick={() => patch({ mode: 'exam' })}>
								Exam (review at end)
							</button>
						</div>
						<div className="row">
							<span className="lbl">Length</span>
							{[10, 25, 50, 0].map((n) => (
								<button key={n} className={'chip' + (cfg.count === n ? ' on' : '')} onClick={() => patch({ count: n })}>
									{n === 0 ? 'All' : n}
								</button>
							))}
						</div>
						<div className="row">
							<label className="check">
								<input type="checkbox" checked={cfg.onlyMissed} disabled={missed.size === 0} onChange={(e) => patch({ onlyMissed: e.target.checked })} />
								Only questions I missed before ({missed.size})
							</label>
						</div>
						<button className="primary" onClick={() => start()} disabled={poolSize === 0} data-testid="start">
							Start · {cfg.count === 0 ? poolSize : Math.min(cfg.count, poolSize)} questions
						</button>
					</section>
					<p className="muted small">Keys: 1–4 choose · Enter next. Options are shuffled every attempt, so explanations never rely on letters.</p>
				</>
			)}

			{screen === 'quiz' && cur && (
				<>
					<div className="top">
						<span className="muted">
							{i + 1} / {deck.length}
						</span>
						<span className="tags">
							<span className="tag" style={{ ['--c' as string]: TOPIC_COLOR[cur.q.topic] }}>
								{TOPIC_LABEL[cur.q.topic]} · {LEVEL_LABEL[cur.q.level]}
							</span>
							<span className="tag dim">{cur.q.tag}</span>
						</span>
						<button className="link" onClick={() => setScreen('home')}>
							Quit
						</button>
					</div>
					<div className="bar">
						<div style={{ width: `${((i + (pick !== null ? 1 : 0)) / deck.length) * 100}%` }} />
					</div>

					<h2 className="q">
						<Rich text={cur.q.q} />
					</h2>
					{cur.q.code && (
						<pre>
							<code>{cur.q.code}</code>
						</pre>
					)}

					<div className="opts" role="radiogroup">
						{cur.options.map((opt, n) => {
							const cls = ['opt'];
							if (pick === n && !revealed) cls.push('picked');
							if (revealed && n === cur.correctIndex) cls.push('good');
							if (revealed && pick === n && n !== cur.correctIndex) cls.push('bad');
							if (revealed && n !== cur.correctIndex && pick !== n) cls.push('dim');
							return (
								<button key={n} className={cls.join(' ')} onClick={() => dispatch({ type: 'pick', n, locked: revealed })} role="radio" aria-checked={pick === n} data-testid={`opt-${n}`}>
									<b>{LETTERS[n]}</b>
									<span>
										<Rich text={opt} />
									</span>
								</button>
							);
						})}
					</div>

					{revealed && (
						<div className={'why' + (pick === cur.correctIndex ? ' ok' : '')} data-testid="why">
							<b>{pick === cur.correctIndex ? '✅ Correct' : '❌ Not quite'}</b>
							<p>
								<Rich text={cur.q.why} />
							</p>
						</div>
					)}

					<div className="nav">
						{cfg.mode === 'exam' && i > 0 ? (
							<button className="ghost" onClick={() => dispatch({ type: 'go', i: i - 1 })}>
								← Back
							</button>
						) : (
							<span />
						)}
						<button className="primary" onClick={next} disabled={pick === null} data-testid="next">
							{i === deck.length - 1 ? 'Finish' : 'Next →'}
						</button>
					</div>
				</>
			)}

			{screen === 'result' && (
				<>
					<header>
						<h1>
							{score} / {deck.length}
						</h1>
						<p className="muted">
							{Math.round((score / deck.length) * 100)}% — {score === deck.length ? 'flawless 🎯' : 'review the misses below, then retry only those'}
						</p>
					</header>
					<div className="nav">
						<button className="ghost" onClick={() => setScreen('home')}>
							Home
						</button>
						<button className="primary" onClick={() => start({ onlyMissed: true, count: 0 })} disabled={missed.size === 0}>
							Retry all missed ({missed.size})
						</button>
					</div>
					<h3>Review</h3>
					{deck.map((d, n) => {
						const ok = picks[n] === d.correctIndex;
						return (
							<details key={d.q.id} className={'rev' + (ok ? ' ok' : '')} open={!ok}>
								<summary>
									{ok ? '✅' : '❌'} <Rich text={d.q.q} />
								</summary>
								{d.q.code && (
									<pre>
										<code>{d.q.code}</code>
									</pre>
								)}
								<p>
									<span className="muted">Your answer:</span> {picks[n] === null ? '—' : <Rich text={d.options[picks[n]!]} />}
								</p>
								<p>
									<span className="good-t">Correct:</span> <Rich text={d.q.correct} />
								</p>
								<p className="why-t">
									<Rich text={d.q.why} />
								</p>
							</details>
						);
					})}
				</>
			)}
		</main>
	);
}
