import dotenv from 'dotenv'

dotenv.config()

const service_mail = process.env.SERVICE_MAIL
const service_password = process.env.SERVICE_PASSWORD


export const getAuthCode = async () => {
  console.log({ service_password, service_mail })
  const rawResponse = await fetch('https://compliance-api.cubos.io/auth/code', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      email: service_mail,
      password: service_password
    }
  })

  if (!rawResponse.ok) {
    console.log({ rawResponse })
    const responsePayload = await rawResponse.json()
    console.log({ responsePayload })
    throw new Error("unable to get authentication code")
  }

  const responsePayload = await rawResponse.json()
  console.log({ responsePayload })
}
