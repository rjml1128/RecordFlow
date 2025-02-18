import CryptoJS from 'crypto-js'

const SECRET_KEY = import.meta.env.VITE_CRYPTO_SECRET_KEY

export const encrypt = async (data) => {
  try {
    const stringData = JSON.stringify(data)
    return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString()
  } catch (error) {
    throw new Error('Encryption failed')
  }
}

export const decrypt = async (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY)
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8)
    return JSON.parse(decryptedString)
  } catch (error) {
    throw new Error('Decryption failed')
  }
}
