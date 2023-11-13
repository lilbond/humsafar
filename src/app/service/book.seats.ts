import { BookingResponse } from '../models/types';

export const bookSeats = async (count: number) => {
	try {
		const response = await fetch('/api/book', {
			method: 'POST',
			body: JSON.stringify({ seatCount: count }),
		});
		const bookingResponse: BookingResponse = await response.json();
		if (bookingResponse.success) {
			return bookingResponse;
		}
	} catch (error) {
		console.log(error);
	}
	return { seats: undefined, success: false };
};
