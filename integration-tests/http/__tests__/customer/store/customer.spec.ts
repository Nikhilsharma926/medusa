import { MedusaContainer } from "@medusajs/types"
import { medusaIntegrationTestRunner } from "medusa-test-utils"
import {
  adminHeaders,
  createAdminUser,
} from "../../../../helpers/create-admin-user"

jest.setTimeout(30000)

medusaIntegrationTestRunner({
  testSuite: ({ dbConnection, api, getContainer }) => {
    let appContainer: MedusaContainer

    beforeEach(async () => {
      appContainer = getContainer()
      await createAdminUser(dbConnection, adminHeaders, appContainer)
    })

    describe("POST /admin/customers", () => {
      it("should fails to create a customer without an identity", async () => {
        const customer = await api
          .post("/store/customers", {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          })
          .catch((e) => e)

        expect(customer.response.status).toEqual(401)
      })

      it("should successfully create a customer with an identity", async () => {
        const signup = await api.post("/auth/customer/emailpass/register", {
          email: "newcustomer@medusa.js",
          password: "secret_password",
        })

        expect(signup.status).toEqual(200)
        expect(signup.data).toEqual({ token: expect.any(String) })

        const customer = await api.post(
          "/store/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          },
          {
            headers: {
              authorization: `Bearer ${signup.data.token}`,
            },
          }
        )

        expect(customer.status).toEqual(200)
        expect(customer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
            has_account: true,
          }),
        })
      })

      it("should successfully create a customer with an identity even if the email is already taken by a non-registered customer", async () => {
        const nonRegisteredCustomer = await api.post(
          "/admin/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          },
          adminHeaders
        )

        expect(nonRegisteredCustomer.status).toEqual(200)
        expect(nonRegisteredCustomer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
            has_account: false,
          }),
        })

        const signup = await api.post("/auth/customer/emailpass/register", {
          email: "newcustomer@medusa.js",
          password: "secret_password",
        })

        expect(signup.status).toEqual(200)
        expect(signup.data).toEqual({ token: expect.any(String) })

        const customer = await api.post(
          "/store/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "Jane",
            last_name: "Doe",
          },
          {
            headers: {
              authorization: `Bearer ${signup.data.token}`,
            },
          }
        )

        expect(customer.status).toEqual(200)
        expect(customer.data).toEqual({
          customer: expect.objectContaining({
            email: "newcustomer@medusa.js",
            first_name: "Jane",
            last_name: "Doe",
            has_account: true,
          }),
        })

        // Check that customers co-exist
        const customers = await api.get("/admin/customers", adminHeaders)

        expect(customers.status).toEqual(200)
        expect(customers.data.customers).toHaveLength(2)
        expect(customers.data.customers).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              first_name: "Jane",
              last_name: "Doe",
              email: "newcustomer@medusa.js",
              has_account: true,
            }),
            expect.objectContaining({
              first_name: "John",
              last_name: "Doe",
              email: "newcustomer@medusa.js",
              has_account: false,
            }),
          ])
        )
      })

      it("should fail to create a customer with an identity when the email is already taken by a registered customer", async () => {
        const firstSignup = await api.post(
          "/auth/customer/emailpass/register",
          {
            email: "newcustomer@medusa.js",
            password: "secret_password",
          }
        )

        expect(firstSignup.status).toEqual(200)
        expect(firstSignup.data).toEqual({ token: expect.any(String) })

        await api.post(
          "/store/customers",
          {
            email: "newcustomer@medusa.js",
            first_name: "John",
            last_name: "Doe",
          },
          {
            headers: {
              authorization: `Bearer ${firstSignup.data.token}`,
            },
          }
        )

        const firstSignin = await api.post("/auth/customer/emailpass", {
          email: "newcustomer@medusa.js",
          password: "secret_password",
        })

        const customer = await api
          .post(
            "/store/customers",
            {
              email: "newcustomer@medusa.js",
              first_name: "Jane",
              last_name: "Doe",
            },
            {
              headers: {
                authorization: `Bearer ${firstSignin.data.token}`,
              },
            }
          )
          .catch((e) => e)

        expect(customer.response.status).toEqual(400)
        expect(customer.response.data.message).toEqual(
          "Request already authenticated as a customer."
        )
      })
    })
  },
})