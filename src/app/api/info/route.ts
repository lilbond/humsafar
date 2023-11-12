import { Seat, SeatRow } from '@/app/models/types';
import { TrainsRepo } from '@/db/trains.repo';

interface Result {
	seatRows: Array<SeatRow> | undefined;
	success: boolean;
}

const repo = new TrainsRepo();
export async function GET(req: Request) {
	let result: Result = {
		seatRows: undefined,
		success: false,
	};

	const seatRowArray = new Map<number, SeatRow>();
	try {
		const [seatRows] = await repo.getAllSeatRows();
		if (seatRows) {
			const result = JSON.parse(JSON.stringify(seatRows));
			if (result.length && result.length > 0) {
				result.forEach((row: any) => {
					seatRowArray.set(
						row.id,
						new SeatRow(row.id, new Array<Seat>())
					);
				});
			}
		}

		const [seats] = await repo.getAllSeats();
		if (seats) {
			const result = JSON.parse(JSON.stringify(seats));
			if (result.length && result.length > 0) {
				result.forEach((row: any) => {
					const seat = new Seat(row.id, row.seat_row_id, row.booked);
					const seatRow = seatRowArray.get(row.seat_row_id);
					seatRow?.seats.push(seat);
				});
			}
		}

		result = {
			seatRows: Array.from(seatRowArray.values()),
			success: true,
		};
	} catch (error) {
		console.log(error);
	}

	return new Response(JSON.stringify(result));
}
