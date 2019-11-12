require('dotenv').config()

const Instagram = require('instagram-web-api')

const { username, password } = process.env

const client = new Instagram({ username, password })

const COMMENTS = [
  '*-*',
  '<3',
  'manda um abraço pra familia'
]

const TARGET_USER = 'enzo'

const AWAIT_TIME_BEFORE_NEXT_COMMENT = 60000

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

const getRandom = itens =>
  itens[Math.floor(Math.random() * itens.length)]

const start = async () => {
  await client.login()

  const data = await client.getPhotosByUsername({
    username: TARGET_USER,
    first: 30
  })

  const remainingIds = data.user
    .edge_owner_to_timeline_media
    .edges
    .map(edge => edge.node.id)

  console.log(`go back after ${remainingIds.length} minutes`)

  for (const id of remainingIds) {
    const text = getRandom(COMMENTS)

    console.log(new Date(), `commenting ${text} on id ${id}`)

    await client.addComment({
      mediaId: id, text
    })

    await sleep(AWAIT_TIME_BEFORE_NEXT_COMMENT)
  }
}

start()
