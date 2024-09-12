export function capitalize(phrase: string, addDot: boolean = false): string {
	if (!phrase) return addDot ? "." : "";
	return (
		phrase.charAt(0).toUpperCase() + phrase.slice(1) + (addDot ? "." : "")
	);
}
