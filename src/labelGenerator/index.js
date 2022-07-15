/* eslint-disable no-unused-vars */
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import JsBarcode from "jsbarcode";
import { getLabelSvgElement } from "./label.js";
import api from '../api';
import callAddFontNormal from './PTSans-normal';
import callAddFontBold from './PTSans-bold';

const OFFSET_X = 0;
const OFFSET_Y = 0;
const VIEWPORT_WIDTH = 101;
const VIEWPORT_HEIGHT = 152;

jsPDF.API.events.push(['addFonts', callAddFontNormal]);
jsPDF.API.events.push(['addFonts', callAddFontBold]);


export default {
  generateLabels: async (data) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: [101, 152]
    });
    doc.setFont("PTSans");

    const dataLength = data.length;
    for (let i = 0; i < dataLength; i++) {
      const svgElement = getLabelSvgElement();
      const addressData = data[i];
      console.log(addressData)
      svgElement.querySelector("#shipping_address-name").textContent = addressData.get("name") || "";
      svgElement.querySelector("#shipping_address-line1").textContent = addressData.get("addressLine1") || "";
      svgElement.querySelector("#shipping_address-line2").textContent = addressData.get("addressLine2") || "";
      svgElement.querySelector("#shipping_address-city").textContent = addressData.get("city") || "";
      svgElement.querySelector("#shipping_address-postcode").textContent = addressData.get("postcode") || "";
      let label = await api.saveAddressLabel({
        user: addressData.get("user"),
        address: [addressData.get("name") || "", addressData.get("addressLine1") || "", addressData.get("addressLine2") || "", addressData.get("city") || "", addressData.get("postcode") || ""].join('\n'),
      })
      let canv = document.createElement('canvas');
      JsBarcode(canv, `cue${label.id}`, {
        height: 100,
        width: 3,
        fontSize: 30
      });
      console.log(canv);

      svgElement.querySelector('#label_barcode').setAttributeNS('http://www.w3.org/1999/xlink','href', canv.toDataURL());
      await doc
        .svg(svgElement, {
          x: OFFSET_X,
          y: OFFSET_Y,
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT
        })
      if (i != dataLength - 1) doc.addPage();
    }     
    doc.save('cb_' + Date.now() + '.pdf') 
  },

  generateLabelFromTrackingCode: async (addressData, boxNumber, trackingCode) => {
    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [105, 148]
      });
      const svgElement = getLabelSvgElement();
      svgElement.querySelector("#shipping_address-name").textContent = addressData.get("name") || "";
      svgElement.querySelector("#shipping_address-line1").textContent = addressData.get("addressLine1") || "";
      svgElement.querySelector("#shipping_address-line2").textContent = addressData.get("addressLine2") || "";
      svgElement.querySelector("#shipping_address-city").textContent = addressData.get("city") || "";
      svgElement.querySelector("#shipping_address-postcode").textContent = addressData.get("postcode") || "";
      svgElement.querySelector("#box_number").textContent = boxNumber;

      let label = await api.saveAddressLabel({
        trackingCode,
        boxNumber,
        user: addressData.get("user"),
        address: [addressData.get("name") || "", addressData.get("addressLine1") || "", addressData.get("addressLine2") || "", addressData.get("city") || "", addressData.get("postcode") || ""].join('\n'),
      })
      var canv = document.createElement('canvas');
      JsBarcode(canv, `cue${label.id}`, {
        height: 100,
        width: 3,
        fontSize: 30
      });
      console.log(canv);
      console.log(canv.toDataURL());
      svgElement.querySelector('#label_barcode').setAttributeNS('http://www.w3.org/1999/xlink','href', canv.toDataURL());
      await doc
        .svg(svgElement, {
          x: OFFSET_X,
          y: OFFSET_Y,
          width: VIEWPORT_WIDTH,
          height: VIEWPORT_HEIGHT
        })
        
      doc.save('cb_' + label.id + '.pdf')  
      return label;
    } catch (err) {
      console.log(err);
      return;
    }
  }
}