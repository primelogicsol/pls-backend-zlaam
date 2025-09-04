// import Stripe from 'stripe'
// import { environment } from '../Config/environments.js'
// import User from '../Models/User.js'

// const stripeInstance = new Stripe(environment.STRIPE_SECRET_KEY)

// class StripeService {
// 	public async createPaymentIntent(data: {
// 		amount: IAmount
// 		description: string
// 		orderId: string
// 		customerId: ObjectId
// 	}) {
// 		try {
// 			const user = await User.findById(data.customerId)

// 			if (!user) {
// 				throw new Error('User not found')
// 			}

// 			let stripeCustomer: Stripe.Customer | Stripe.DeletedCustomer

// 			if (!user?.credentialDetails.stripeCustomerId) {
// 				stripeCustomer = await stripeInstance.customers.create({
// 					email: user?.credentialDetails.email,
// 					name: user?.personalInformation.name,
// 					phone: user?.personalInformation.phoneNumber,
// 				})

// 				user.credentialDetails.stripeCustomerId = stripeCustomer.id

// 				await user?.save()
// 			} else {
// 				stripeCustomer = await stripeInstance.customers.retrieve(
// 					user.credentialDetails.stripeCustomerId
// 				)
// 			}

// 			const paymentIntent = await stripeInstance.paymentIntents.create({
// 				amount: data.amount.amount,
// 				currency: data.amount.currency,
// 				description: data.description,
// 				metadata: {
// 					cartId: data.orderId,
// 				},
// 				customer: stripeCustomer.id,
// 			})
// 			const url = await this.getHostedLinkForCheckout(paymentIntent)

// 			return { paymentIntent, hostedUrl: url }
// 		} catch (error) {
// 			throw error
// 		}
// 	}
// 	public async getHostedLinkForCheckout(paymentIntent: any) {
// 		try {
// 			const session = await stripeInstance.checkout.sessions.create({
// 				payment_method_types: ['card'],
// 				mode: 'payment',
// 				customer: paymentIntent.customer,
// 				line_items: [
// 					{
// 						price_data: {
// 							currency: paymentIntent.currency,
// 							product_data: {
// 								name: paymentIntent.description || 'Your Product',
// 							},
// 							unit_amount: paymentIntent.amount, // Stripe expects amount in cents
// 						},
// 						quantity: 1,
// 					},
// 				],
// 				metadata: paymentIntent.metadata,
// 				success_url: `https://yourdomain.com/success?session_id={CHECKOUT_SESSION_ID}`,
// 				cancel_url: `https://yourdomain.com/cancel`,
// 			})

// 			return session.url // Hosted checkout link
// 		} catch (error) {
// 			console.error('Error creating checkout session:', error)
// 			return null
// 		}
// 	}
// }

// export default new StripeService()

//************************************************************
// public async paymentSheetForOrder(
// 	id: ObjectId | string,
// 	userId: ObjectId
// ): Promise<{ clientSecret: string; hostedUrl?: any }> {
// 	const order = await Order.findById(id)

// 	if (!order || order.orderStatus !== 'confirmed') {
// 		throw new Error('Invalid Response')
// 	}
// 	let amount =
// 		order.price.amount + order?.GST?.amount + order?.deliveryPrice?.amount
// 	if (order.paymentIntentId) {
// 		return { clientSecret: order.paymentIntentId, hostedUrl: order.hostedUrl }
// 	}
// 	amount = Math.round(amount * 100) / 100
// 	const { paymentIntent: intent, hostedUrl } =
// 		await StripeService.createPaymentIntent({
// 			amount: {
// 				amount: amount * 100,
// 				currency: order.price.currency || 'cad',
// 			},
// 			description: 'Payment for order by SolaBran',
// 			orderId: order._id.toString(),
// 			customerId: userId,
// 		})

// 	if (!intent.client_secret) {
// 		throw new Error('Payment intent failed to be created')
// 	}

// 	order.paymentIntentId = intent.client_secret
// 	order.hostedUrl = hostedUrl ?? ''

// 	await order.save()

// 	return { clientSecret: intent.client_secret, hostedUrl }
// }

//************************************************************************** */
// createIntentForOrder: async (req: Request, res: Response) => {
// 	try {
// 		if (
// 			req.user.personalInformation.phoneNumber === null ||
// 			req.user.personalInformation.phoneNumber === ''
// 		) {
// 			return res.status(400).json({
// 				success: false,
// 				message:
// 					'Please update your phone number in account settings to create order',
// 			})
// 		}

// 		const { orderId } = req.query

// 		const intent = await OrderRepository.paymentSheetForOrder(
// 			orderId as string,
// 			req.user._id
// 		)

// 		res.status(201).json({
// 			success: true,
// 			intent: typeof intent === 'string' ? intent : intent.clientSecret,
// 			hostedUrl:
// 				typeof intent === 'object' && intent !== null
// 					? (intent.hostedUrl as string | undefined)
// 					: undefined,
// 			message: 'Payment intent created successfully',
// 		})
// 	} catch (error) {
// 		returnError(req, res, error)
// 	}
// },
