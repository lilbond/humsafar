import { TrainsRepo } from '@/db/trains.repo';

interface Result {
	sucess: boolean;
}

const repo = new TrainsRepo();
export async function GET(req: Request) {
	let result = undefined;
	try {
		await repo.generateSeedData();
		result = {
			success: true,
		};
	} catch (error) {
		result = { success: false };
		console.log(error);
	}
	return new Response(JSON.stringify(result));
}
