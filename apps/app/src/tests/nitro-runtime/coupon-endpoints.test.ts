import { describe, expect, test } from 'vitest'
import { createCouponEndpointDefinitions } from '../../../server/modules/coupon/endpoints'
import { createCouponMockRepository } from '../../../server/modules/coupon/repository'
import {
  createEndpointRegistry,
  dispatchEndpoint,
  findEndpointDefinition,
} from '../../../server/shared/runtime/endpoint-registry'

describe('coupon endpoints', () => {
  test('registers shared coupon endpoints', () => {
    const registry = createEndpointRegistry(
      createCouponEndpointDefinitions(createCouponMockRepository()),
    )

    expect(findEndpointDefinition(registry, 'GET', '/app/couponProperty.listCouponPropertyUserDetail')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/couponProperty.writeOffCouponPropertyUser')).toBeTruthy()
    expect(findEndpointDefinition(registry, 'POST', '/app/reserveOrder.saveReserveGoodsConfirmOrder')).toBeTruthy()
  })

  test('keeps coupon, integral and reserve response structures stable', async () => {
    const registry = createEndpointRegistry(
      createCouponEndpointDefinitions(createCouponMockRepository()),
    )

    const couponResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/couponProperty.listCouponPropertyUserDetail',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const integralResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/integral.listIntegralSetting',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    const reserveResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/reserveOrder.listReserveGoodsConfirmOrder',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
      },
    })

    expect(Array.isArray(couponResponse.data.list)).toBe(true)
    expect(Array.isArray(integralResponse.data)).toBe(true)
    expect(Array.isArray(reserveResponse.data.list)).toBe(true)
  })

  test('persists write-off mutations through the shared endpoints', async () => {
    const registry = createEndpointRegistry(
      createCouponEndpointDefinitions(createCouponMockRepository()),
    )

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/couponProperty.writeOffCouponPropertyUser',
      body: {
        couponQrcode: 'CPN_TEST_001',
        communityId: 'COMM_001',
        giftCount: 1,
      },
    })

    await dispatchEndpoint(registry, {
      method: 'POST',
      path: '/app/reserveOrder.saveReserveGoodsConfirmOrder',
      body: {
        timeId: 'TIME_TEST_001',
        communityId: 'COMM_001',
      },
    })

    const couponResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/couponProperty.listCouponPropertyUserDetail',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
        couponQrcode: 'CPN_TEST_001',
      },
    })

    const reserveResponse = await dispatchEndpoint(registry, {
      method: 'GET',
      path: '/app/reserveOrder.listReserveGoodsConfirmOrder',
      query: {
        page: 1,
        row: 5,
        communityId: 'COMM_001',
        reserveQrcode: 'TIME_TEST_001',
      },
    })

    expect(couponResponse.data.list[0]).toMatchObject({
      couponQrcode: 'CPN_TEST_001',
    })
    expect(reserveResponse.data.list[0]).toMatchObject({
      reserveQrcode: 'TIME_TEST_001',
    })
  })
})
