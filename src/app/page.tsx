'use client';

import React from 'react';
import styles from './page.module.css';
import { DataGenerator } from '@/lib/data.generator';
import { Seat, SeatRow } from '@/app/models/types';
import { ReactNode } from 'react';
import { generateData } from './service/generate.seed.data';
import { bookSeats } from './service/book.seats';

const GenerateSeedDataMessages = {
	onFailure: 'Failed to generate seed data.',
	onSucesss: 'Seed data generated successfully.',
};

const BookingMessages = {
	onFailure: 'Failed to book ticket.',
	onSucesss: 'Booking successfull.',
	onWrongInput: 'Seat count should be between 1 and 7',
};

export default function Home() {
	const [showAlert, setShowAlert] = React.useState(false);
	const [apiSuccess, setApiSuccess] = React.useState(false);
	const [alertMessage, setAlertMessage] = React.useState('');
	const [bookedSeats, setBookedSeats] = React.useState<any | undefined>(
		undefined
	);
	const [isLoading, setIsLoading] = React.useState(true);
	const [showWaitDialog, setShowWaitDialog] = React.useState(false);
	const [seatRows, setSeatRows] = React.useState<Array<SeatRow> | undefined>(
		undefined
	);
	const [dataGenerated, setDataGenerated] = React.useState(false);

	React.useEffect(() => {
		const fetchSeatRows = async () => {
			// NO CATCH
			fetch('/api/info')
				.then((response) => {
					return response.json();
				})
				.then((obj) => {
					console.log(obj);
					setSeatRows(obj.seatRows);
				})
				.finally(() => {
					setIsLoading(false);
				});
		};

		fetchSeatRows();
	}, [bookedSeats, dataGenerated]);

	const handleBooking = (count: number) => {
		if (count < 1 || count > 7) {
			setApiSuccess(false);
			setAlertMessage(BookingMessages.onWrongInput);
		} else {
			setShowWaitDialog(true);
			setTimeout(() => {
				bookSeats(count)
					.then((result) => {
						if (result.success) {
							setApiSuccess(true);
							setBookedSeats(result.seats);
							setAlertMessage(BookingMessages.onSucesss);
						} else {
							setApiSuccess(false);
							setAlertMessage(BookingMessages.onFailure);
						}
					})
					.catch(() => {
						setApiSuccess(false);
						setAlertMessage(BookingMessages.onFailure);
					})
					.finally(() => {
						setShowAlert(true);
						setShowWaitDialog(false);
					});
			}, 1000);
		}
	};

	const generateSeedData = () => {
		setShowWaitDialog(true);
		setDataGenerated(false);
		setTimeout(() => {
			generateData()
				.then((result) => {
					if (result) {
						setApiSuccess(true);
						setAlertMessage(GenerateSeedDataMessages.onSucesss);
						setDataGenerated(true);
					} else {
						setApiSuccess(false);
						setAlertMessage(GenerateSeedDataMessages.onFailure);
					}
				})
				.catch(() => {
					setApiSuccess(false);
					setAlertMessage(GenerateSeedDataMessages.onFailure);
				})
				.finally(() => {
					setShowAlert(true);
					setShowWaitDialog(false);
				});
		}, 1000);
	};

	const onAlertClose = () => {
		setShowAlert(false);
	};

	return (
		<>
			<main className={styles.main}>
				<div className={styles.container}>
					<div className={styles.gridContainer + ' ' + styles.paper}>
						<div
							className={
								styles.gridItem +
								' ' +
								styles.italics +
								' ' +
								styles.secondaryColor
							}
						>
							Delete existing data and re-generate seed data.
						</div>
						<div className={styles.gridItem}>
							<button
								className={
									styles.btn + ' ' + styles.btnSecondary
								}
								onClick={generateSeedData}
							>
								Execute &gt;
							</button>
						</div>
					</div>
					<div
						className={
							styles.gridContainer +
							' ' +
							styles.paper +
							' ' +
							styles.marginLeft
						}
					>
						<div className={styles.gridItem}>
							<BookingView handleBooking={handleBooking} />
						</div>
					</div>
				</div>
				<div className={styles.container}>
					{seatRows && (
						<CoachView
							seatRows={seatRows}
							bookedSeats={bookedSeats}
						/>
					)}
				</div>
				{showAlert && (
					<Alert
						success={apiSuccess}
						message={alertMessage}
						onClose={onAlertClose}
					/>
				)}
			</main>
			<WaitDialog open={showWaitDialog} />
		</>
	);
}

interface AlertProps {
	success: boolean;
	message: string;
	onClose: () => void;
}

function Alert(props: AlertProps) {
	const { success, message, onClose } = props;
	const unifiedClassName =
		styles.alert + ' ' + (success ? styles.successBg : styles.failureBg);

	return (
		<div className={unifiedClassName}>
			<span className={styles.alertClosebtn} onClick={onClose}>
				&times;
			</span>
			{message}
		</div>
	);
}

interface WaitDialogProps {
	open: boolean;
}

function WaitDialog(props: WaitDialogProps) {
	const { open } = props;
	return (
		<div
			style={{ display: open ? 'flex' : 'none' }}
			className={styles.modal}
		>
			<div className={styles.modalContent}>
				<div className={styles.loader}></div>
				<div className={styles.modalText}>Please Wait</div>
			</div>
		</div>
	);
}

interface BookingViewProps {
	handleBooking: (count: number) => void;
}

function BookingView(props: BookingViewProps) {
	const { handleBooking } = props;
	const [seatCountForBooking, setSeatCountForBooking] = React.useState(0);
	return (
		<div>
			<form>
				<input
					type='number'
					className={styles.bookingInput}
					placeholder='Number of seats to book'
					onChange={(e) => {
						const count = e.target.value
							? parseInt(e.target.value)
							: 0;
						setSeatCountForBooking(count);
					}}
				/>
				<button
					className={styles.btn + ' ' + styles.btnSecondary}
					onClick={() => {
						handleBooking(seatCountForBooking);
					}}
					type='button'
				>
					Click To Book !!!
				</button>
			</form>
		</div>
	);
}

interface CoachViewProps {
	seatRows: Array<SeatRow>;
	bookedSeats: any | undefined;
}

function CoachView(props: CoachViewProps) {
	const { seatRows, bookedSeats } = props;

	const seatRowsNode = new Array<ReactNode>();
	console.log(seatRows);
	if (seatRows && seatRows.length > 0) {
		seatRows.forEach((seatRow) => {
			seatRowsNode.push(
				<SeatRowView
					key={seatRow.id}
					seatRow={seatRow}
					bookedSeats={bookedSeats}
				/>
			);
		});
	}

	return <div className={styles.coach}>{...seatRowsNode}</div>;
}

interface SeatRowViewProps {
	seatRow: SeatRow;
	bookedSeats: any | undefined;
}

function SeatRowView(props: SeatRowViewProps) {
	const { seatRow, bookedSeats } = props;

	const seats = new Array<ReactNode>();
	seatRow.seats.forEach((seat) => {
		seats.push(
			<SeatView
				key={seat.id + '-' + seat.rowId}
				seat={seat}
				bookedSeats={bookedSeats}
			/>
		);
	});

	return (
		<div className={styles.seatRow + ' ' + styles.paper}>
			<div className={styles.seatRowLabel}>
				<div>{'R-' + seatRow.id}</div>
			</div>
			{...seats}
		</div>
	);
}

interface SeatViewProps {
	seat: Seat;
	bookedSeats: any | undefined;
}

function SeatView(props: SeatViewProps) {
	const { seat, bookedSeats } = props;
	let background = seat.booked
		? styles.bookedBackground
		: styles.secondaryBackground;
	return (
		<div className={styles.seat + ' ' + background}>
			{seat.id.toString()}
		</div>
	);
}
