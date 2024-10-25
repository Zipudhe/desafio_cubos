import dotenv from 'dotenv'

dotenv.config()

const service_mail = process.env.SERVICE_MAIL
const service_password = process.env.SERVICE_PASSWORD
const complianceUrl = "https://compliance-api.cubos.io"

export const getAuthCode = async () => {
  const rawResponse = await fetch(`${complianceUrl}/auth/code`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    },
    body: {
      email: service_mail,
      password: service_password
    },
  })

  console.log({ rawResponse })

  if (rawResponse.status != 200) {
    return 0;
  }

  const { authCode } = await rawResponse.json()
  return authCode
}

export const getAuthToken = async (authCode: string) => {
  const rawResponse = await fetch(`${complianceUrl}/auth/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: {
      authCode
    }
  })

  if (rawResponse.status != 200) {
    return 0;
  }

  const { accessToken } = await rawResponse.json()
  return accessToken
}

export const getDocumentType = (document: string): 'cpf' | 'cnpj' => {
  const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

  if (cpfRegex.exec(document)) {
    return 'cpf'
  }

  return 'cnpj'
}


export const validateDocument = async (document: string): Promise<boolean> => {

  const type = getDocumentType(document)

  const authCode = await getAuthCode()

  if (!authCode) {
    return false
  }

  const accessToken = await getAuthToken(authCode)

  if (!accessToken) {
    return false
  }

  const rawResponse = await fetch(`${complianceUrl}/${type}/validade`, {
    method: 'POST',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json',
      'Authorization': accessToken
    },
    body: {
      email: service_mail,
      password: service_password
    },
  })

  const { data: { status } } = await rawResponse.json()

  return status == 1
}
