import 'dotenv/config'
import fetch from 'cross-fetch';

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const HOURS = 8 + (randomIntFromInterval(0, 6)/10);

const ONE_SECOND = 1000;

const ONE_MINUTE = 60 * ONE_SECOND;

const ONE_HOUR = 60 * ONE_MINUTE;

function Countdown(options: { seconds: number, onUpdateStatus: (seconds: number) => void, onCounterEnd: () => void}) {
  var timer: ReturnType<typeof setInterval> | number,
  instance = this,
  seconds = options.seconds || 10,
  updateStatus = options.onUpdateStatus || function () {},
  counterEnd = options.onCounterEnd || function () {};

  async function decrementCounter() {
    await updateStatus(seconds);
    if (!seconds) {
      await counterEnd();
      instance.stop();
    }
    seconds--;
  }

  this.start = function () {
    clearInterval(timer);
    timer = 0;
    seconds = options.seconds;
    timer = setInterval(decrementCounter, 1000);
  };

  this.stop = function () {
    clearInterval(timer);
  };
}

const { OAUTH_TOKEN, CHANNEL_ID } = process.env


const URI = 'https://slack.com/api/chat.postMessage'

const postMessage = async (randomIndex: number) => {
  if(OAUTH_TOKEN && CHANNEL_ID) {
    await fetch(URI, { 
      method: 'post', 
      body: JSON.stringify({
        channel: CHANNEL_ID,
        text: [':',':'].join(['joy', 'young_aaron', 'nguyen', 'votevish', 'igai', 'aaaaaaw-yeahhhh', 'ferris-bongo'][randomIndex])
      }), 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OAUTH_TOKEN}`
      }
    })
  }
  return await Promise.reject('Missing OAUTH_TOKEN and CHANNEL_ID')
}

const timeInDay = ONE_HOUR * HOURS

const myCounter = new Countdown({  
  seconds: timeInDay,  // number of seconds to count down
  onUpdateStatus: async function(sec) { 
    if(sec === timeInDay) {
      await postMessage(randomIntFromInterval(0, 6))
    }
  }, // callback for each second
  onCounterEnd: async function() { 
    await postMessage(randomIntFromInterval(0, 6))
    console.log('counter ended!');} // final action
});

import cron from 'cron';

const CronJob = cron.CronJob

let dayOfWeek: number = 0

var job = new CronJob(
	'0 0 8 * * 1-5',
	// '*/10 * * * * *',
	async function() {
    dayOfWeek = (new Date()).getDay();

    if([0,6].includes(dayOfWeek)) {
      return
    }
    myCounter.start();

	},
	null,
	true,
	'Asia/Ho_Chi_Minh'
);

job.start()