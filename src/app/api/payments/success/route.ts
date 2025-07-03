// app/checkout/success/route.ts (si es un route handler)
import { NextRequest, NextResponse } from 'next/server'
import { getPaymentInfo } from '@/lib/mercado-pago'

export async function GET(request: NextRequest) {
    const url = new URL(request.url)
    const paymentId = url.searchParams.get('payment_id')
    console.log('Recibido paymentId:', paymentId)
    if (!paymentId) {
        return NextResponse.json({ error: 'Falta el ID de pago' }, { status: 400 })
    }

    try {

        const payment = await getPaymentInfo(paymentId)
        const orderId = payment.external_reference
        console.log('Respuesta MercadoPago payment info:', payment)

        if (!orderId) {
            return NextResponse.json({ error: 'No se encontró la orden asociada al pago' }, { status: 404 })
        }

        // Redirigir con el order_id ya recuperado
        return NextResponse.redirect(`/checkout/success?order_id=${orderId}`)
    } catch (error) {
        console.error('Error obteniendo información del pago:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
