export interface BookingResponse {
	seats: Array<Seat> | undefined;
	success: boolean;
}

export class Seat {
	id: number;
	rowId: number;
	booked: boolean;

	constructor(id: number, rowId: number, booked: boolean = false) {
		this.id = id;
		this.rowId = rowId;
		this.booked = booked;
	}
}

export class SeatRow {
	id: number;
	seats: Array<Seat>;

	constructor(id: number, seats: Array<Seat>) {
		this.id = id;
		this.seats = seats;
	}
}
