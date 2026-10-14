import { inline } from './lib/inline';

/** Renders `code` and **bold** markers as elements (no dangerouslySetInnerHTML). */
export function Rich({ text }: { text: string }) {
	return (
		<>
			{inline(text).map((s, i) =>
				s.kind === 'code' ? <code key={i} className="ic">{s.t}</code> : s.kind === 'bold' ? <strong key={i}>{s.t}</strong> : s.t
			)}
		</>
	);
}
