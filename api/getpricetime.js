import getbasedcumulativeprice from '../src/getpricetimescript'

module.exports = (req, res) => {
    getbasedcumulativeprice()
    res.status(200).send('oracle sees price')
}