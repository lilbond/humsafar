import { BookingResponse, Seat } from '@/app/models/types';
import { TrainsRepo } from '@/db/trains.repo';

const repo = new TrainsRepo();
export async function POST(req: Request) {
	const obj = await req.json();
	let response: BookingResponse = {
		seats: undefined,
		success: true,
	};

	if (obj.seatCount >= 1 && obj.seatCount <= 7) {
		try {
			const [rows, _] = await repo.bookSeats(obj.seatCount);
			const seats = new Array<Seat>();
			if (rows) {
				const result = JSON.parse(JSON.stringify(rows));
				if (result.length && result.length > 0) {
					result[0].forEach((row: any) => {
						const seat = new Seat(
							row.id,
							row.seat_row_id,
							row.booked
						);
						seats.push(seat);
					});
				}
				response = {
					seats,
					success: true,
				};
			}
		} catch (error) {
			console.log(error);
		}
	}

	return new Response(JSON.stringify(response));
}
