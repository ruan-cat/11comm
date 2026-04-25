export function formatDateTime(input: Date | string | number | null | undefined): string {
	if (input === null || input === undefined || input === "") {
		return "";
	}

	const date = input instanceof Date ? input : new Date(input);

	if (Number.isNaN(date.getTime())) {
		return String(input);
	}

	const year = date.getFullYear();
	const month = pad2(date.getMonth() + 1);
	const day = pad2(date.getDate());
	const hours = pad2(date.getHours());
	const minutes = pad2(date.getMinutes());
	const seconds = pad2(date.getSeconds());

	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function pad2(value: number): string {
	return String(value).padStart(2, "0");
}
