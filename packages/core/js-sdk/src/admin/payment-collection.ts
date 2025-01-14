import { HttpTypes, SelectParams } from "@medusajs/types"
import { Client } from "../client"
import { ClientHeaders } from "../types"

export class PaymentCollection {
  /**
   * @ignore
   */
  private client: Client
  /**
   * @ignore
   */
  constructor(client: Client) {
    this.client = client
  }

  async create(
    body: HttpTypes.AdminCreatePaymentCollection,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionResponse>(
      `/admin/payment-collections`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }

  async delete(id: string, headers?: ClientHeaders) {
    return await this.client.fetch<HttpTypes.AdminDeletePaymentCollectionResponse>(
      `/admin/payment-collections/${id}`,
      {
        method: "DELETE",
        headers,
      }
    )
  }

  async markAsPaid(
    id: string,
    body: HttpTypes.AdminMarkPaymentCollectionAsPaid,
    query?: SelectParams,
    headers?: ClientHeaders
  ) {
    return await this.client.fetch<HttpTypes.AdminPaymentCollectionResponse>(
      `/admin/payment-collections/${id}/mark-as-paid`,
      {
        method: "POST",
        headers,
        body,
        query,
      }
    )
  }
}
