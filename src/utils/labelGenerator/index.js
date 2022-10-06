/* eslint-disable no-unused-vars */
import { jsPDF } from "jspdf";
import "svg2pdf.js";
import JsBarcode from "jsbarcode";
import { getLabelSvgElement } from "./label.js";
import api from '../../api';
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
      const lineSpacing = 65;
      const chunksRegex = /.{1,25}(\s|$)/g;
      const addressToElementMap = {
        "shipping_address-name": "name",
        "shipping_address-line1": "addressLine1",
        "shipping_address-line2": "addressLine2",
        "shipping_address-city": "city",
        "shipping_address-postcode": "postcode",
      }
      
      let currentLineStart = 0;
      for (let k in addressToElementMap) {
        svgElement.querySelector(`#${k}`).textContent = "";
        let chunks = (addressData.get(addressToElementMap[k]) || "").match(chunksRegex);
        svgElement.querySelector(`#${k}`).setAttributeNS(null, "y", currentLineStart);
        if (!chunks) continue;
        chunks.forEach(c => {
          let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.textContent = c;
          tspan.setAttributeNS(null, "y", currentLineStart);
          tspan.setAttributeNS(null, "x", 0);
          currentLineStart += lineSpacing;
          svgElement.querySelector(`#${k}`).appendChild(tspan)
        })
      }
      
      let label = await api.saveAddressLabel({
        user: addressData.get("user"),
        name: addressData.get("name"),
        address: [addressData.get("addressLine1") || "", addressData.get("addressLine2") || "", addressData.get("city") || "", addressData.get("postcode") || ""].join('\n'),
      })
      let canv = document.createElement('canvas');
      JsBarcode(canv, `cue${label.id}`, {
        height: 100,
        width: 3,
        fontSize: 30
      });
      console.log(canv);

      svgElement.querySelector('#label_barcode').setAttributeNS('http://www.w3.org/1999/xlink','href', canv.toDataURL());
      console.log(svgElement);
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
      const lineSpacing = 65;
      const chunksRegex = /.{1,25}(\s|$)/g;
      const svgElement = getLabelSvgElement();
      const addressToElementMap = {
        "shipping_address-name": "name",
        "shipping_address-line1": "addressLine1",
        "shipping_address-line2": "addressLine2",
        "shipping_address-city": "city",
        "shipping_address-postcode": "postcode",
      }
      
      let currentLineStart = 0;
      for (let k in addressToElementMap) {
        svgElement.querySelector(`#${k}`).textContent = "";
        let chunks = (addressData.get(addressToElementMap[k]) || "").match(chunksRegex);
        svgElement.querySelector(`#${k}`).setAttributeNS(null, "y", currentLineStart);
        if (!chunks) continue;
        chunks.forEach(c => {
          let tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.textContent = c;
          tspan.setAttributeNS(null, "y", currentLineStart);
          tspan.setAttributeNS(null, "x", 0);
          currentLineStart += lineSpacing;
          svgElement.querySelector(`#${k}`).appendChild(tspan)
        })
      }
      
      let label = await api.saveAddressLabel({
        trackingCode,
        boxNumber,
        user: addressData.get("user"),
        name: addressData.get("name"),
        address: [addressData.get("addressLine1") || "", addressData.get("addressLine2") || "", addressData.get("city") || "", addressData.get("postcode") || ""].join('\n'),
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
      return {label, pdf: doc.output('blob')};
    } catch (err) {
      console.log(err);
      return;
    }
  }
}