export type Seg = { t: string; kind: 'text' | 'code' | 'bold' };

/** Splits a string with `code` and **bold** markers into renderable segments (no {@html}, so no XSS surface). */
export function inline(s: string): Seg[] {
	return s
		.split(/(`[^`]+`|\*\*[^*]+\*\*)/g)
		.filter(Boolean)
		.map((p): Seg =>
			p.startsWith('`') ? { t: p.slice(1, -1), kind: 'code' } : p.startsWith('**') ? { t: p.slice(2, -2), kind: 'bold' } : { t: p, kind: 'text' }
		);
}
