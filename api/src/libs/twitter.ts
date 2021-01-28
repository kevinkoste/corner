import Twitter from 'twitter'

const client = new Twitter({
  consumer_key: process.env.TWITTER_BEARER_TOKEN as string,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET as string,
  bearer_token: process.env.TWITTER_BEARER_TOKEN as string,
})

export default client
