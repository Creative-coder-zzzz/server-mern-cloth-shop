import paypal from 'paypal-rest-sdk'

paypal.configure({
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENTID,
  client_secret: process.env.PAYPAL_CLIENTSECRET
})

export default paypal;