import { Seat } from '../models/types';

export interface BookingResponse {
	seats: Array<Seat> | undefined;
	success: boolean;
}

export interface BookSeats {
	seats: Array<Seat>;
}

export class BookingSagaRequest {
	private seatCount: number;
	private token: string;

	constructor(seatCount: number, token: string) {
		this.seatCount = seatCount;
		this.token = token;
	}

	getSeatCount = () => {
		return this.seatCount;
	};

	getToken = () => {
		return this.token;
	};
}

export class BookingSagaResponse {
	private success: boolean;
	private seats: Array<Seat>;
	private token: string;
	private reason: string | undefined;

	constructor(
		success: boolean,
		seats: Array<Seat>,
		token: string,
		reason: string | undefined = undefined
	) {
		this.success = success;
		this.seats = seats;
		this.token = token;
		this.reason = reason;
	}

	isSuccess = () => {
		return this.success;
	};

	getSeats = () => {
		return this.seats;
	};

	getToken = () => {
		return this.token;
	};

	getReason = () => {
		return this.reason;
	};
}
