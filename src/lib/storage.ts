// localStorage is a per-viewer convenience: always wrapped, app works without it.
const KEY = 'rnt-missed-v1';

export function loadMissed(): Set<string> {
	try {
		return new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
	} catch {
		return new Set();
	}
}

export function saveMissed(s: Set<string>) {
	try {
		localStorage.setItem(KEY, JSON.stringify([...s]));
	} catch {
		/* private mode / blocked */
	}
}
