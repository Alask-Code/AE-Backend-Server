"use strict";

/*
* An event is an object as follows:
* event = {
*	type: string describing type of event,
*	sessionId: sessionID to which this event belongs.
*	scheduledTime: unixtime in milliseconds of when this event should be scheduled.
*	data: Object corresponding to the type.*
*/

class ScheduledEventHandler {
	constructor(scheduleIntervalMillis) {
		this.eventCallbacks = {};

		this.loadSchedule();
		
		setInterval(() => {
			this.processSchedule();
		}, scheduleIntervalMillis * 1000);
	}

	addEvent(type, worker) {
		this.eventCallbacks[type] = worker;
	}

	saveToDisk() {
		fileIO.write(db.user.events.schedule, this.scheduledEvents);
	}

	loadSchedule() {
		if (!fileIO.exist(db.user.events.schedule)) {
			this.scheduledEvents = [];
			return;
		}

		this.scheduledEvents = fileIO.readParsed(db.user.events.schedule);
	}

	processSchedule() {
		let now = Date.now();

		while (this.scheduledEvents.length > 0) {
			let event = this.scheduledEvents.shift();

			if (event.scheduledTime < now) {
				this.processEvent(event);
				continue;
			}
			
			// The schedule is assumed to be sorted based on scheduledTime, so once we
			// see an event that should not yet be processed, we can exit the loop.
			this.scheduledEvents.unshift(event);
			break;
		}
	}

	addToSchedule(event) {
		this.scheduledEvents.push(event);
		this.scheduledEvents.sort(compareEvent);
	}

	removeFromSchedule(event) {
		const index = this.scheduledEvents.indexOf(event);

		if (index > -1) {
			return this.scheduledEvents.splice(index, 1);
		}

		return false;
	}

	getScheduleForSession(sessionID) {
		return this.scheduledEvents.filter(event => event.sessionId === sessionID);
	}

	wipeScheduleForSession(sessionID) {
		this.getScheduleForSession(sessionID)
			.forEach(event => this.removeFromSchedule(event));

		this.saveToDisk();
	}

	processEvent(event) {
		if (event.type in this.eventCallbacks) {
			this.eventCallbacks[event.type](event);
		}
	}
}

/* Compare function for events based on their scheduledTime. */
function compareEvent(a, b) {
	if (a.scheduledTime < b.scheduledTime) {
		return -1;
	}

	if (a.scheduledTime > b.scheduledTime) {
		return 1;
	}

	return 0;
}

module.exports.scheduledEventHandler = new ScheduledEventHandler(serverConfig.eventPollIntervalSec);