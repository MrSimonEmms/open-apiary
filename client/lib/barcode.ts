/**
 * barcode
 */

/* Node modules */

/* Third-party modules */
import QRCode from 'qrcode';
import VueI18Next from '@panter/vue-i18next';

/* Files */
import { IApiary, IHive } from '../../server/apiary/interfaces/apiary';
import logo from '../static/img/icon.png';

export default class Barcode {
  public debug: boolean = false;

  // @todo get this from the store
  protected appName: string = 'OpenApiary';

  protected apiary: IApiary;

  protected hives: IHive[];

  protected i18n: VueI18Next;

  constructor(apiary: IApiary, hives: IHive[], i18n: VueI18Next) {
    this.apiary = apiary;
    this.hives = hives;
    this.i18n = i18n;
  }

  async generatePDF() {
    /* Dynamically load as requires browser environment */
    const { default: PDF } = await import('jspdf');

    const pageOpts : {
      orientation: 'p'|'portrait'|'l'|'landscape';
      format: string;
    } = {
      orientation: 'portrait',
      format: 'a4',
    };

    const logoString = await Barcode.logoString();

    let col = 1;
    const maxCols = 4;

    let row = 1;
    const maxRows = 4;

    let page = 1;
    const width = 52;
    const height = 74;

    const doc = new PDF(pageOpts);

    await Promise.all(this.hives.map(async (hive) => {
      const qrcode = await Barcode.generateQRCode(hive.uuid);

      /* Create the outline to help with cutting */
      doc.setDrawColor(204, 204, 204);
      const rect = {
        x: width * (col - 1),
        y: height * (row - 1),
      };
      doc.rect(rect.x + 2.5, rect.y + 2.5, width - 5, height - 5, 'S');

      /* Set the logo image */
      doc.setFontSize(14);
      doc.addImage(logoString, 'png', 4.5 + rect.x, 5 + rect.y);
      doc.text(this.appName, 19.5 + rect.x, 13 + rect.y);

      /* Add the QR Code */
      doc.addImage(qrcode, 'png', 6 + rect.x, 20 + rect.y, 40, 40);

      /* Add the hive information */
      doc.setFontSize(10);
      doc.text([
        this.i18n.t('hive:DOCUMENT.APIARY', {
          name: this.apiary.name,
        }),
        this.i18n.t('hive:DOCUMENT.HIVE', {
          number: hive.apiaryCount,
        }),
      ], 4.5 + rect.x, 63 + rect.y, {
        lineHeightFactor: 1.5,
      });

      /* Update the col/row/page */
      if (col < maxCols) {
        col += 1;
      } else {
        /* Reset column and bump row */
        col = 1;

        if (row < maxRows) {
          row += 1;
        } else {
          /* New page - add page and reset col/row */
          col = 1;
          row = 1;
          page += 1;
          doc.addPage(pageOpts.format, pageOpts.orientation);
          doc.setPage(page);
        }
      }
    }));

    if (this.debug) {
      doc.output('dataurlnewwindow');
    } else {
      doc.output('save', 'barcode.pdf');
    }
  }

  static async logoString() {
    return new Promise((resolve) => {
      const img = new Image();

      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = function onload(this: any) {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve('');
          return;
        }
        ctx.drawImage(this, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL.replace(/^data:image\/(png|jpg);base64,/, ''));
      };

      img.src = logo;
    });
  }

  static async generateQRCode(uuid: string) {
    return QRCode.toDataURL(uuid, {
      type: 'image/png',
      errorCorrectionLevel: 'H',
      scale: 3,
    });
  }
}
