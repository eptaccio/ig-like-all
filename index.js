require('dotenv').config()
const Instagram = require('instagram-web-api')

const {
  USER_NAME,
  PASSWORD,
  TARGET_USER
} = process.env

const instagramClient = new Instagram({
  username: USER_NAME,
  password: PASSWORD
})

const AWAIT_TIME_BEFORE_NEXT_LIKE = 60000

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

const start = async () => {
  await instagramClient.login()

  const data = await instagramClient.getPhotosByUsername({
    username: TARGET_USER,
    first: 300,
    after: 40
  })

  const remainingIds = data.user
    .edge_owner_to_timeline_media
    .edges
    .map(edge => edge.node.id)

  console.log(`go back after ${remainingIds.length} minutes`)

  for (const mediaId of remainingIds) {
    console.log(new Date(), `adding like on ${mediaId} from @${TARGET_USER}`)

    await instagramClient.like({
      mediaId
    })

    await sleep(AWAIT_TIME_BEFORE_NEXT_LIKE)
  }
}

start()
