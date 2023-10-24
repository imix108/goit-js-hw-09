import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] > new Date()) {
      document.querySelector('[data-start]').removeAttribute('disabled');
    } else {
        document.querySelector('[data-start]').setAttribute('disabled', 'true');
        Notiflix.Notify.failure("Please choose a date in the future");
    }
  },
};

const picker = flatpickr("#datetime-picker", options);
const startButton = document.querySelector('[data-start]');
const timerFields = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

let countdownInterval;

function updateTimerDisplay(time) {
  timerFields.days.textContent = time.days.toString().padStart(2, '0');
  timerFields.hours.textContent = time.hours.toString().padStart(2, '0');
  timerFields.minutes.textContent = time.minutes.toString().padStart(2, '0');
  timerFields.seconds.textContent = time.seconds.toString().padStart(2, '0');
}

startButton.addEventListener('click', () => {
  const selectedDate = picker.selectedDates[0];
  const now = new Date();
  if (selectedDate > now) {
    clearInterval(countdownInterval);
    countdownInterval = setInterval(() => {
      const remainingTime = selectedDate - new Date();
      if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const timeObject = convertMs(remainingTime);
        updateTimerDisplay(timeObject);
      }
    }, 1000);
  }
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}