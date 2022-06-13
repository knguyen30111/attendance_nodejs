import 'dotenv/config'
import cron from 'cron';
import fetch from 'cross-fetch';

const { OAUTH_TOKEN, CHANNEL_ID } = process.env

function randomIntFromInterval(min: number, max: number) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}


const URI = 'https://slack.com/api/chat.postMessage'

const postMessage = async (randomIndex: number) => {
  if(OAUTH_TOKEN && CHANNEL_ID) {
    await fetch(URI, { 
      method: 'post', 
      body: JSON.stringify({
        channel: CHANNEL_ID,
        text: [':',':'].join([
          'joy',
          'young_aaron',
          'nguyen',
          'votevish',
          'igai',
          'aaaaaaw-yeahhhh',
          'ferris-bongo',
          'laughing',
        ][randomIndex])
      }), 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OAUTH_TOKEN}`
      }
    })
    return console.log(123)
  }
  return await Promise.reject('Missing OAUTH_TOKEN and CHANNEL_ID')
}

const CronJob = cron.CronJob

let dayOfWeek: number = 0

var job = new CronJob(
	'0 25 7-19 * * 1-5',
	// '*/10 * * * * *',
	async function() {
    dayOfWeek = (new Date()).getDay();

    if([0,6].includes(dayOfWeek)) {
      return
    }
    await postMessage(randomIntFromInterval(0,6))

	},
	null,
	true,
	'Asia/Ho_Chi_Minh'
);

job.start()