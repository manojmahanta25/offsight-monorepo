import * as qrcode from 'qrcode'

export class QrCodeUtil {

    async generateQrCode(text: string):Promise<string> {
       return  await qrcode.toDataURL(text);
    }
}