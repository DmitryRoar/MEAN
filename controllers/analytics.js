const moment = require('moment')

const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function(req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-10, 'd').format('DD.MM.YYYY')] || []

        // количество заказов вчера
        const yesterdayOrdersNumber = yesterdayOrders.length
        // количество заказов
        const totalOrdersNumber = allOrders.length
        // количество дней всего
        const daysNumber = Object.keys(ordersMap).length
        // Заказов в день
        const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0)
        // ((заказов вчера / количество заказов в день) -1) * 100
        // Процент для количества заказов
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)
        // общая выручка
        const totalGain = calculatePrice(allOrders)
        // выручка в день
        const gainPerDay = totalGain / daysNumber
        // выручка за вчера
        const yesterdayGain = calculatePrice(yesterdayOrders)
        // процент выручки
        const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2)
        // сравнение выручки
        const compareGain = (yesterdayGain - gainPerDay).toFixed(2)
        // сравнение количества заказов
        const compareNumber = (yesterdayOrdersNumber - ordersPerDay).toFixed(2)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +yesterdayGain,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.analytics = async function(req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)

        // средний чек
        const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2)

        // данные графики (ось x)
        const chart = Object.keys(ordersMap).map(label => {
            // label -> 05.05.2020
            const gain = calculatePrice(ordersMap[label])
            const order = ordersMap[label].length

            return {label, order, gain}
        })

        res.status(200).json({average, chart})
    } catch (e) {
        errorHandler(res, e)
    }
}

function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        }
        if (!daysOrders[date]) {
            daysOrders[date] = []
        }

        daysOrders[date].push(order)
    })
    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((acc, order) => {
        const orderPrice = order.list.reduce((orderTotal, i) => {
            return orderTotal += i.cost * i.quantity
        }, 0)
        return acc += orderPrice
    }, 0)
}
