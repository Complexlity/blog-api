import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
    res.send('I am from the comments area')
})

export default router