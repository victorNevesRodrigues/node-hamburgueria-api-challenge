const express = require('express')
const app = express()
const uuid = require('uuid')
const port = 3000
app.use(express.json())
const orders = []

const idChecker = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex((order) => order.id === id)
    
    if (index < 0){
        response.status(404).json({Error:"User Not Found"})
    }

    request.userId = id
    request.userIndex = index

    next()
}


app.get('/order', (request, response) => {
    response.json(orders)
})

app.post('/order', (request, response) => {
    const {order, clientName, price} = request.body

    const userOrder = {id:uuid.v4(), order, clientName, price, status:"Em preparação"}

    orders.push(userOrder)
    response.status(201).json()
})

app.put('/order/:id', idChecker, (request, response) => {
    const {order, clientName, price} = request.body
    const id = request.userId
    const index = request.userIndex
    const userModifier = {id, order, clientName, price, status:"Em preparação"}
   
    orders[index] = userModifier

    return response.json(userModifier)
})

app.delete('/order/:id', idChecker, (request, response) => {
    const index = request.userIndex
    if (index >= 0){
    orders.splice(index, 1)
}
    return response.status(204).json({message: "excluded"})
})

app.get('/order/:id', idChecker, (request, response) => {
    const index = request.userIndex
    return response.json(orders[index])
})

app.patch('/order/:id', idChecker, (request, response) => {
    const index = request.userIndex
    const id = request.userId
    const {order, clientName, price} = orders[index]
    const orderStatusChange = {id, order, clientName, price, status:"ready to eat"}
    orders[index] = orderStatusChange
    return response.json(orders)
})







app.listen(port, () => {
    console.log('👀 Server initialized at 3000 port 👀')
})
