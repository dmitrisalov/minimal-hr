import clock from "clock";
import document from "document";
import { me as appbit } from "appbit";
import { preferences } from "user-settings";

import { HeartRateSensor } from "heart-rate";
import { FitFont } from 'fitfont';

import * as util from "../common/utils";

// Vars
const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

// Get handles for all the display elements
const dayLabel = new FitFont({ id: 'dayLabel', font: 'fonts/Lekton_30', halign: 'end' });
const dateLabel = new FitFont({ id: 'dateLabel', font: 'fonts/Lekton_30', halign: 'start' });
const hourLabel = new FitFont({ id: 'hourLabel', font: 'fonts/Lekton_150', halign: 'end' });
const minuteLabel = new FitFont({ id: 'minuteLabel', font: 'fonts/Lekton_70', halign: 'start' });
const periodLabel = new FitFont({ id: 'periodLabel', font: 'fonts/Lekton_30', halign: 'start' });
const heartRateLabel = new FitFont({ id: 'heartRateLabel', font: 'fonts/Lekton_45', halign: 'middle', valign: 'middle' });

/**
 * Updates all of the labels on the face of the clock (besides the heart rate)
 */
const updateClockFace = (event) => {
    let time = event.date;
    let hours = time.getHours();
    let minutes = time.getMinutes();
    let period = ""
    let dayOfMonth = time.getDate();
    let month = time.getMonth();
    let dayOfWeek = time.getDay();

    // Adjust for 12/24h preferences
    if (preferences.clockDisplay === "12h") {
        if (hours >= 12) {
            period = "PM"
        }
        else {
            period = "AM"
        }

        // 12h format
        hours = hours % 12 || 12;
    }

    // Updating labels
    hourLabel.text = util.zeroPad(hours);
    minuteLabel.text = util.zeroPad(minutes);
    periodLabel.text = period;
    dateLabel.text = util.zeroPad(month) + '/' + util.zeroPad(dayOfMonth);
    dayLabel.text = WEEK_DAYS[dayOfWeek];
}

// RUNNING THE APP //

clock.granularity = "minutes";

// Update the clock elements with each tick
clock.ontick = (event) => {
    updateClockFace(event);
}

// Check if heart rate sensor exists and app has permissions to access it
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    const heartRateSensor = new HeartRateSensor();
    // Set up heart rate listener and start
    heartRateSensor.addEventListener("reading", () => {
        heartRateLabel.text = heartRateSensor.heartRate.toString();
    });

    heartRateSensor.start();
}
else {
    heartRateLabel.text = '--';
}
