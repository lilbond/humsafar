import { DataGenerator } from '@/lib/data.generator';
import executeQuery from '@/lib/db.helper';
import { Seat, SeatRow } from '@/app/models/types';

export class TrainsRepo {
	private dataGenerator: DataGenerator;

	constructor(dataGenerator: DataGenerator = new DataGenerator()) {
		this.dataGenerator = dataGenerator;
	}

	addSeatRow = async (seatRow: SeatRow) => {
		const query = 'INSERT INTO seat_row(id) VALUES(?)';
		const values = [seatRow.id];
		await executeQuery(query, values);
	};

	addSeat = async (seat: Seat) => {
		const query =
			'INSERT INTO seat(id, seat_row_id, booked) VALUES(?, ?, ?)';
		const values = [seat.id, seat.rowId, seat.booked ? 1 : 0];
		await executeQuery(query, values);
	};

	bookSeats = async (seatCount: number) => {
		const query = 'call sp_book(?)';
		return await executeQuery(query, [seatCount]);
	};

	getAllSeats = async () => {
		const query = 'select * from seat order by seat_row_id, id';
		return await executeQuery(query, []);
	};

	getAllSeatRows = async () => {
		const query = 'select * from seat_row';
		return await executeQuery(query, []);
	};

	/**
	 * Only for seed data
	 */
	private deleteSeedData = async () => {
		const query = 'delete from seat_row';
		const values = Array<any>();
		await executeQuery(query, values);
	};

	generateSeedData = async () => {
		try {
			await this.deleteSeedData();

			const seatRows = this.dataGenerator.generate();
			seatRows.forEach(async (row: SeatRow) => {
				await this.addSeatRow(row);

				row.seats.forEach(async (seat: Seat) => {
					await this.addSeat(seat);
				});
			});
		} catch (error) {
			console.log(error);
		}
	};
}
