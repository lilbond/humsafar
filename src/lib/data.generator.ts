import { Seat, SeatRow } from '@/app/models/types';

const NumberOfSeats = 7;
const NumberOfSeatsInLastRow = 3;
const TotalNumberOfSeats = 80;
const NumberOfRows = Math.floor(TotalNumberOfSeats / 7) + 1;

export class DataGenerator {
	generate = () => {
		let seats = new Array<Seat>();
		const seatRows = new Array<SeatRow>();

		for (let rowNumber = 0; rowNumber < NumberOfRows; rowNumber++) {
			const numberOfSeats =
				rowNumber == NumberOfRows - 1
					? NumberOfSeatsInLastRow
					: NumberOfSeats;

			for (let seatNumber = 0; seatNumber < numberOfSeats; seatNumber++) {
				const seat = new Seat(seatNumber + 1, rowNumber + 1, false);
				seats.push(seat);

				if (seatNumber == numberOfSeats - 1) {
					const seatsInRow = new Array<Seat>();
					const seatRow = new SeatRow(rowNumber + 1, seats);
					seatRows.push(seatRow);
					seats = new Array<Seat>();
				}
			}
		}

		return seatRows;
	};
}
