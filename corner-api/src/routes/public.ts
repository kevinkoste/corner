import express from 'express'
import axios from 'axios'
import cheerio from 'cheerio'

import { processSiteTitle, getModeAndFreq } from '../libs/utils'
import UserModel from '../models/User'
import twitter from '../libs/twitter'

const router = express.Router()

// GET /public/profile - public route to access profile information
router.get('/profile', async (req, res) => {
  const { username } = req.query
  if (typeof username !== 'string') {
    return res.status(200).send(false)
  }

  const user = await UserModel.findOne({ username: username }).exec()
  if (user?.username) {
    return res.status(200).send({
      username: user.username,
      components: user.components,
    })
  }
  return res.status(200).send(false)
})

// GET /public/profile/all - public route to access all profiles
router.get('/profile/all', async (req, res) => {
  const users = await UserModel.find({})
  const result = users
    .filter((user) => user.username && user.components)
    .map((user) => {
      return {
        username: user.username,
        components: user.components,
      }
    })
  return res.status(200).send(result)
})

// GET /public/availability - public route to test username availability
router.get('/availability', async (req, res) => {
  const { username } = req.query
  if (typeof username !== 'string') {
    return res.status(200).send(false)
  }

  const user = await UserModel.findOne({ username: username }).exec()

  if (user) {
    // username is not available
    return res.status(200).send(false)
  }

  // username is available
  return res.status(200).send(true)
})

// GET /public/employer/ - gets employer data from url
router.get('/employer', async (req, res) => {
  if (!('domain' in req.query)) {
    return res.status(200).send(false)
  }

  if (!(req.query.domain as string).includes('.')) {
    return res.status(200).send(false)
  }

  try {
    const parsedDomain = `http://${req.query.domain}`

    const page = await axios.get(parsedDomain)

    const $ = cheerio.load(page.data)

    // scrape all of these, process them
    const title = $('head > title').text()
    const ogtitle = $("meta[property='og:title']").attr('content')
    const ogsitename = $("meta[property='og:site_name']").attr('content')

    const all = []
    if (title !== undefined && title !== null) {
      all.push(processSiteTitle(title))
    }
    if (ogtitle !== undefined && ogtitle !== null) {
      all.push(processSiteTitle(ogtitle))
    }
    if (ogsitename !== undefined && ogsitename !== null) {
      all.push(processSiteTitle(ogsitename))
    }

    const { mode, greatestFreq } = getModeAndFreq(all)

    let result: string
    if (greatestFreq > 1) {
      result = mode.trim()
    } else {
      all.sort((a, b) => a.length - b.length)
      result = all[0].trim()
    }

    return res.status(200).send(result)
  } catch {
    return res.status(200).send(false)
  }
})

// GET /public/twitter/ - public route to access profile information
router.get('/twitter', async (req, res) => {
  const { username } = req.query
  if (typeof username !== 'string') {
    return res.status(200).send(false)
  }

  try {
    const twitterRes = await twitter.get(`/2/users/by/username/${username}`, {})
    return res.status(200).send(twitterRes)
  } catch (err) {
    console.log(err)
    return res.status(200).send(false)
  }
})

export default router
