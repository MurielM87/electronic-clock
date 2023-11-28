window.addEventListener("DOMContentLoaded",() => {
	const c = new Clock4(".clock");
});

class Clock4 {
	constructor(el) {
		this.el = document.querySelector(el);

		this.init();
	}
	init() {
		this.timeUpdate();
	}
	get timeAsObject() {
		const date = new Date();
		let h = date.getHours();
		const m = date.getMinutes();
		const ap = h > 11 ? "PM" : "AM";
		// deal with midnight
		if (h === 0) h += 12;
		else if (h > 12) h -= 12;

		return { h, m, ap };
	}
	get timeAsString() {
		let { h, m, ap } = this.timeAsObject;
		// prepend 0 to the minute if single digits
		if (m < 10) m = `0${m}`;

		let timestamp = `${h}:${m} ${ap}`;

		return timestamp;
	}
	get timeDigits() {
		const stringParts = this.timeAsString.split(" ");
		const digits = [...stringParts[0].replace(":","").split(""),stringParts.pop()];
		const propNames = ["h_t","h_o","m_t","m_o","ap"];
		const digitsReversed = digits.reverse();
		const propNamesReversed = propNames.reverse();
		const objectOfDigits = {};

		propNamesReversed.forEach((name,i) => {
			objectOfDigits[name] = digitsReversed[i] || "";
		});

		return objectOfDigits;
	}
	timeUpdate() {
		// update the `aria-label`
		this.el?.setAttribute("aria-label", this.timeAsString);
		// update the digits
		const digits = this.timeDigits;
		Object.keys(digits).forEach(unit => {
			const unitEl = this.el.querySelector(`[data-unit="${unit}"]`);
			if (!unitEl) return;

			const digit = digits[unit];
			unitEl.setAttribute("data-digit",digit);
		});
		// loop
		clearTimeout(this.timeUpdateLoop);
		this.timeUpdateLoop = setTimeout(this.timeUpdate.bind(this),1e3);
	}
}