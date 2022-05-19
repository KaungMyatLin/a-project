const NodeRSA = require('node-rsa');            // Commonjs_Module
import constants from './constants/apiIntePcs_Const';   // ES_Module
// DOMObj let and const variables
const md_sel = document.querySelector("#main_dish_div select");
const meat_sel = document.querySelector("#choose_meat_div select");
const nood_sel = document.querySelector("#choose_noodle_div select");
let dCust_sel = document.querySelector("#option_customize_div select")
const noofplat_inp = document.querySelector("#quantity_div input")
const alertList = document.querySelector("#frm1_checkout button");
const addtoListfrm = document.querySelector("#frm1_done button");
const submitfrm2 = document.querySelector("#frm2_checkout button");
let hidInvalidWarn = document.querySelector("#hidInvalidWarn")
const fn_inp = document.querySelector(".fn input");
const ln_inp = document.querySelector(".ln input");
const ph_inp = document.querySelector(".field2 input");
const typ_sel = document.querySelector(".field6 select");
const mtd_sel = document.querySelector(".field7 select");
const add_inp = document.querySelector(".field3 input");
const des_inp = document.querySelector(".field4 input");
const email_inp = document.querySelector(".field8 input");
const billAdd_inp = document.querySelector(".field9 input");
const billCity_inp = document.querySelector(".field10 input");
// functional Events
document.addEventListener("DOMContentLoaded", () => {
  const mdId_sel = document.querySelector("#main_dish");  //doesn't work with main_dish-div select.
  mdId_sel.addEventListener("change", e => {
    const dCust_sel = document.querySelector("#option_customize_div");//doesn't work with option_customize.
    if ( e.target.options[e.target.options.selectedIndex].text == "--Choose Menu--"
    ) {
      dCust_sel.hidden = true;
      return;
    } else if ( e.target.options[e.target.options.selectedIndex].text == "Sichat"
    ) {
      dCust_sel.hidden = true;
    } else {
      dCust_sel.hidden = false;
    }
  });

  const typId_sel = document.querySelector("#payment_type");
  const mtdId_sel = document.querySelector("#payment_method");
  const email_inp = document.querySelector("#em");
  const billAdd_inp = document.querySelector("#ba");
  const billCity_inp = document.querySelector("#bc");
  typId_sel.addEventListener("change", e => {
    email_inp.hidden = true;
    billAdd_inp.hidden = true;
    billCity_inp.hidden = true;
    mtdId_sel.selectedIndex = 0;
    const mtdId_htmlOptCol = mtdId_sel.options;
    if ( e.target.options[e.target.options.selectedIndex].text === "Visa"
      || e.target.options[e.target.options.selectedIndex].text === "JCB"
      || e.target.options[e.target.options.selectedIndex].text === "MAB") {
            email_inp.hidden = false;
            billAdd_inp.hidden = false;
            billCity_inp.hidden = false;
            Array.from(mtdId_htmlOptCol).map(opt => {
              if (opt.value === "QR") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "OTP") opt.disabled = false; //correct
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "WAVE PAY"
      || e.target.options[e.target.options.selectedIndex].text === "Citizens"
      || e.target.options[e.target.options.selectedIndex].text === "Mytel"
      || e.target.options[e.target.options.selectedIndex].text === "Sai Sai Pay"
      || e.target.options[e.target.options.selectedIndex].text === "Onepay"
      || e.target.options[e.target.options.selectedIndex].text === "MPitesan") {
            Array.from(mtdId_htmlOptCol).map(opt => {
              if (opt.value === "QR") opt.disabled = true;
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = false;
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "KBZ Direct Pay") {
            Array.from(mtdId_htmlOptCol).map(opt => {
              if (opt.value === "QR") opt.disabled = true;
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = false;
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "AYA Pay") {
            Array.from(mtdId_htmlOptCol).map(opt => {
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "QR") opt.disabled = false;
              if (opt.value === "PIN") opt.disabled = false;
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "KBZ Pay") {
            Array.from(mtdId_htmlOptCol).map(opt => {
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "QR") opt.disabled = false;
              if (opt.value === "PWA") opt.disabled = false;
            })
    }
  });
});
addtoListfrm.addEventListener("click", event => {
  event.preventDefault();
  create_ordLst();
});
alertList.addEventListener("click", event => {
  event.preventDefault();
  alert(JSON.stringify(cart, null, " "));
});
submitfrm2.addEventListener("click", event => {
  event.preventDefault();
  post_chkout();
});
// global let variables & templates
let cart = [];
let addingToCardCountStart = 0;
let jsonStr_getTok = '';
const rTmpl_Items = {
  md_val: {
    Sichat: 'Sichat',
    KyayOh: 'KyayOh',
    'KyayOh Sichat': 'KyayOh Sichat',
  },
  meat_val: {
    Pork: 'Pork',
    Poultry: 'Poultry',
  },
  nood_val: {
    Vermicelli: 'Vermicelli',
    Wheat: 'Wheat',
  },
}
const rTmpl_flds = {
  pp: {
    "AYA Pay": "AYA Pay",
    "KBZ Pay": "KBZ Pay",
    Visa: "Visa",
    Master: "Master",
    JCB: "JCB",
    MAB: "MAB",
    MPU: "MPU",
    "WAVE PAY": "WAVE PAY",
    Citizens: "Citizens",
    Mytel: "Mytel",
    "Sai Sai Pay": "Sai Sai Pay",
    Onepay: "Onepay",
    MPitesan: "MPitesan",
    "CB Pay": "CB Pay",
    "KBZ Direct Pay": "KBZ Direct Pay"
  },
  pm: {
    QR: 'QR',
    PIN: 'PIN',
    OTP: 'OTP',
    PWA: 'PWA',
  },
}
// functions
const sendHttpReq = async (method, url, {payload, contType = "application/json", bearerToken} = {}) => {
  return await fetch(url, {
    method,
    body: payload,
    headers: {
      ...(contType && {"Content-type": contType})
      ,...(bearerToken && {"Authorization": "Bearer " + bearerToken})
    },
  })
  .then(resp => {
      if (resp.status < 200 && resp.status >= 300) {
        return new Promise(() => {
          throw new Error(
            "Something went wrong between you sent and server receiving"
        )});
      }
      return resp;
  })
  .then(resp => {
      if(resp.code == "000" || resp.ok) {
        return resp;
      } //guard clause
      return new Promise(() => {
        throw new Error(
          " server responsed with backend error code: " +
          resp.code +
          " - responsed message: " +
          resp.message
      )});
  })
  .catch(error => {
      console.log(error);
  });
}
async function get_authToken() {
  return await sendHttpReq("GET"
    ,constants.getApi)
  .then(res => {
    return res.json();
  })
  .then(prmInJson => {
    return prmInJson.response.paymentToken });
}
async function post_chkout() {
  const fn_val = fn_inp.value;
  const ln_val = ln_inp.value;
  const ph_val = ph_inp.value;
  const typ_val = typ_sel.value;
  const mtd_val = mtd_sel.value;
  const add_val = add_inp.value;
  const des_val = des_inp.value;
  const ema_val = email_inp.value;
  const ba_val = billAdd_inp.value;
  const bc_val = billCity_inp.value;
  // if user doesn't select any, show hidden warning.
  if (
    !(cart.length)
    || fn_val == '' || ln_val == '' || ph_val == ''
    || typ_val == 0 || mtd_val == 0
    ||  (
          (typ_val === "Visa" || typ_val === "Master" || typ_val === "JCB")
          && (ema_val === '' || ba_val === '' || bc_val === '')
        )
    ){
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> Please Add 1 item to cart. (or) Please Fill out all * required boxes.</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    return;
  }
  // if 'check' against Template pp and pm.
  if (!(rTmpl_flds.pp[typ_val] && rTmpl_flds.pm[mtd_val])){
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> The item you selected doesn't exist.</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    return;
  }
  hidInvalidWarn.hidden = true;
  // get 'const' orderId & calculatedTotal.
  const orderId = getRandomIntInclusive(0,10000);
  const total = getTtlOfCalcPricesQty(cart);
  // create 'obj' postPayload.
  const cObj_postPayload = {
    providerName: typ_val,
    methodName: mtd_val,
    orderId: orderId + '',
    customerPhone: ph_val,
    customerName: fn_val + ' ' + ln_val,
    description: des_val ?? '',
    customerAddress: add_val ?? '',
    totalAmount: total,
    Items: cart
  };

  const nodersa = new NodeRSA();
  nodersa.importKey(constants.pubKey, 'pkcs8-public');
  // (keyData, [format])
  // keyData = {PEM string|Buffer containing PEM string|Buffer containing DER encoded data|Object contains key components}
  // format = [scheme-[key_type]-[output_type] ]
  // Scheme = 'pkcs1' or 'pkcs8' or 'openssh' or 'components'. Default 'pkcs1_oaep'.
  // Key type = 'private' or 'public'. Default 'private'.
  // output_type = 'pem' — Base64 encoded with header and footer. Used by default, 'der' — Binary encoded key data.
  nodersa.setOptions({encryptionScheme: 'pkcs1'});
  // .encrypt alrdy provide Json.stringify to first arg, buffer. Second arg is encoding for output.
  const payload = nodersa.encrypt(cObj_postPayload,'base64');

  console.log("postPayload_dataObj: ", cObj_postPayload);
  console.log("payload: "+payload);
  // get 'token' to send in header field.
  jsonStr_getTok = constants.getToken ?? await get_authToken() ?? null;
  // appending 'base64' encoding as form field in body.
  // const fd = new FormData();
  // fd.append('', "payload="+payload);
  const obj_resD = await sendHttpReq("POST"
    ,constants.payApi, {payload: "payload="+payload
      ,contType: constants.payHttpPostMIME
      ,bearerToken: jsonStr_getTok})
      .then(res => {
        return res.json();
      })
      .then(data => {
        return data;
      });
  console.log(obj_resD);
  // get 'providerName and methodName' to redirect respectively.
  let oLocation = '';
  const {providerName, methodName} = cObj_postPayload;
  // // if (providerName === 'AYA')
  // // location.assign("http://www.mozilla.org");
  console.log(JSON.stringify(cObj_postPayload, null, " "));
}
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
const create_ordLst = () => {
  const md_val = md_sel.value;
  const meat_val = meat_sel.value;
  const nood_val = nood_sel.value;
  let dishCustom_val = dCust_sel.value;
  const numberofplates_val = noofplat_inp.value;
  // if user doesn't select any, show hidden warning.
  if (md_val, meat_val, nood_val, numberofplates_val == 0){
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> Please Fill out all * required boxes.</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    return;
  }
  // if 'check' against Template items.
  if (!(rTmpl_Items.md_val[md_val] && rTmpl_Items.meat_val[meat_val] && rTmpl_Items.nood_val[nood_val])) {
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> The item you selected doesn't exist.</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    return;
  }
  hidInvalidWarn.hidden = true;
  // if is there any customization.
  if (dishCustom_val == 0) dishCustom_val = null;
  // if 'check' spamming more than 20 click on addingToCard.
  if (addingToCardCountStart > 20) {
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> You have already submitted this form 20 times. Please refresh the page or please submit a new form.</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    return;
  };
  // create 'obj' main dish.
  const cObj_md = {
    name: md_val
      + ',' + meat_val
      + ',' + nood_val
      + ',' + dishCustom_val ?? 'No Customization'};
  // read 'name' to get price.
  const md_type = cObj_md.name.split(',')[0];
  let price;
  if (md_type === "Sichat") { price = 1500; }
  else if (md_type === "KyayOh") { price = 4000; }
  else if (md_type === "KyayOh Sichat") { price = 4300; }
  // create 'obj' items.
  const cObj_itemsField = {
    ... cObj_md
    , amount  : price
    , quantity: numberofplates_val};
  // if 'check' cart contain zero type.
  if (cart.length == 0) cart.push(cObj_itemsField);
  else {
    const el = getElOfTheOrderAlrdyContain(cObj_itemsField, cart);
    // if there's any type that already contained, or else simply push.
    if (true && el) {
      const noofplates_Inc  = parseInt(el.quantity) + parseInt(numberofplates_val) + '';
      cart = cart.filter(t => t !== el);

      const replacinObj = {
        ... cObj_md
        , amount  : price
        , quantity: noofplates_Inc};
      cart.push(replacinObj);
    }
    else {
      cart.push(cObj_itemsField);
    }
  }
  // return and count click.
  addingToCardCountStart++;
  return cart;
}
const getTtlOfCalcPricesQty = (list) => {
  let price;

  return list.reduce( (sum, cur) => {
      const {name, quantity} = cur;
      const md_type = name.split(',')[0];

      if (md_type === "Sichat") { price = 1500; }
      else if (md_type === "KyayOh") { price = 4000; }
      else if (md_type === "KyayOh Sichat") { price = 4300; }

      return price * quantity + sum;
  }, 0)
}
const getElOfTheOrderAlrdyContain = (obj, list) => {
  return list.find((t) =>
    t.name === obj.name
  );
}
// // import * as NodeRSA from '../node_modules/node-rsa/src/NodeRSA.js';
// //'application/x-www-form-urlencoded'
// // let cartItem = {
// //   objec: {},
// //   get getGetter() {
// //     return this.objec;
// //   },
// //   set setSetter(set) {
// //     this.objec = set;
// //   }
// // };
// // const isVarAPureObj = (obj) => {
// //     return (typeof obj === 'object' &&
// //     !Array.isArray(obj) &&
// //     obj !== null);
// // }
// // console.log(md_val, meat_val, nood_val, dishCustom_val, numberofplates_val);
// // console.log(JSON.stringify(cart, null, " "));