export const generateData = async () => {
	try {
		const response = await fetch('/api/seed');
		const obj = await response.json();
		if (obj.success) {
			return true;
		}
	} catch (error) {
		console.log(error);
	}
	return false;
};
