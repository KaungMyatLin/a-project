const NodeRSA = require('node-rsa');            // Commonjs_Module
import constants from './constants/apiIntePcs_Const';   // ES_Module
// let and const htmlFormElements
const md_sel = document.querySelector("#main_dish_div select");
const meat_sel = document.querySelector("#choose_meat_div select");
const nood_sel = document.querySelector("#choose_noodle_div select");
const dCust_selDiv = document.querySelector("#option_customize_div");
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
const email_inpDiv = document.querySelector(".field8");
const billAdd_inpDiv = document.querySelector(".field9");
const billCity_inpDiv = document.querySelector(".field10");
const email_inp = document.querySelector(".field8 input");
const billAdd_inp = document.querySelector(".field9 input");
const billCity_inp = document.querySelector(".field10 input");
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
// Click EventListeners
document.addEventListener("DOMContentLoaded", () => {
  md_sel.addEventListener("change", e => {
    // ---------Update dish selected index change---------
    if ( e.target.options[e.target.options.selectedIndex].text == "--Choose Menu--"
    || e.target.options[e.target.options.selectedIndex].text == "Sichat"
    ) {
      dCust_selDiv.hidden = true;
      return;
    } else {
      dCust_selDiv.hidden = false;
    }
  });
  // ---------Update business selected index change---------
  typ_sel.addEventListener("change", e => {
    email_inpDiv.hidden = true;
    billAdd_inpDiv.hidden = true;
    billCity_inpDiv.hidden = true;
    mtd_sel.selectedIndex = 0;
    const mtd_htmlOptCol = mtd_sel.options;
    if ( e.target.options[e.target.options.selectedIndex].text === "Visa"
      || e.target.options[e.target.options.selectedIndex].text === "JCB"
      || e.target.options[e.target.options.selectedIndex].text === "Master") {
    console.log("typ_sel changed. ", e.target.options[e.target.options.selectedIndex].text);
            email_inpDiv.hidden = false;
            billAdd_inpDiv.hidden = false;
            billCity_inpDiv.hidden = false;
            Array.from(mtd_htmlOptCol).map(opt => {
              if (opt.value === "QR") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "OTP") opt.disabled = false;    //correct
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "MPU"
      || e.target.options[e.target.options.selectedIndex].text === "MAB Bank" ) {
            Array.from(mtd_htmlOptCol).map(opt => {
              if (opt.value === "QR") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "OTP") opt.disabled = false;    //correct
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "WAVE PAY"
      || e.target.options[e.target.options.selectedIndex].text === "Citizens"
      || e.target.options[e.target.options.selectedIndex].text === "Mytel"
      || e.target.options[e.target.options.selectedIndex].text === "Sai Sai Pay"
      || e.target.options[e.target.options.selectedIndex].text === "Onepay"
      || e.target.options[e.target.options.selectedIndex].text === "MPitesan") {
            Array.from(mtd_htmlOptCol).map(opt => {
              if (opt.value === "QR") opt.disabled = true;
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = false;    //correct
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "KBZ Direct Pay") {
            Array.from(mtd_htmlOptCol).map(opt => {
              if (opt.value === "QR") opt.disabled = true;
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = false;    //correct
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "AYA Pay") {
            Array.from(mtd_htmlOptCol).map(opt => {
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "QR") opt.disabled = false;     //correct
              if (opt.value === "PIN") opt.disabled = false;    //correct
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "KBZ Pay") {
            Array.from(mtd_htmlOptCol).map(opt => {
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "QR") opt.disabled = false;     //correct
              if (opt.value === "PWA") opt.disabled = false;    //correct
            })
    }
    if ( e.target.options[e.target.options.selectedIndex].text === "CB Pay") {
            Array.from(mtd_htmlOptCol).map(opt => {
              if (opt.value === "OTP") opt.disabled = true;
              if (opt.value === "PIN") opt.disabled = true;
              if (opt.value === "PWA") opt.disabled = true;
              if (opt.value === "QR") opt.disabled = false;     //correct
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
// Main Functions
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
      if( (resp.status < 200 && resp.status >= 300)
      || !resp.ok) {
        return new Promise(() => {
          throw new Error(
            "Something went wrong between you sent and server receiving. "
            +"Responsed message: "+resp.message
        )});
      }
      return resp;
  })
  .then(resp => {
    breakOk: if(resp.ok) {   //guard clause
        if ( resp.code && resp.code !== "000") { break breakOk; }
        return resp.json();
      }
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
  // ---------Create Validation against formFieldMissing & legitFieldSelectable---------
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
  // ---------Create orderId & calculatedTotal---------
  const orderId = getRandomIntInclusive(0,10000);
  const total = getTtlOfCalcPricesQty(cart);
  // ---------Create 'obj' postPayload or more fields to add to payload for Visa, Master, JCB---------
  let cObj_postPayload = {
    providerName: typ_val,
    methodName: mtd_val,
    orderId: orderId + '',
    customerPhone: ph_val,
    customerName: fn_val + ' ' + ln_val,
    description: des_val ?? '',
    customerAddress: add_val ?? '',
    totalAmount: total,
    items: JSON.stringify(cart, null, " ")
  };
  const {providerName, methodName} = cObj_postPayload;
  if (
    (providerName === 'Visa')
    || (providerName === 'Master' )
    || (providerName === 'JCB' )
  ) {
    cObj_postPayload = {
      ...cObj_postPayload,
      email: ema_val,
      billAddress: ba_val,
      billCity: bc_val
    }
  }
  // ---------Node RSA encryption---------
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
  const encryptstr_payload = nodersa.encrypt(cObj_postPayload,'base64');
  // ---------Get 'token' to send in post header authentication---------
  jsonStr_getTok = constants.getToken ?? await get_authToken() ?? null;
  // ---------Encrypted object in the body of post as KV&KV queryString---------
  const paramObj = {payload: encryptstr_payload};
  const data = new URLSearchParams(paramObj);
  const strJson_resD = await sendHttpReq("POST"
      ,constants.payApi
      ,{payload: data
      ,contType: constants.payHttpPostMIME
      ,bearerToken: jsonStr_getTok})
  // ---------Logging---------
  console.log("postPayload_dataObj= ", cObj_postPayload);
  console.log("payload= ", encryptstr_payload);
  console.log("promise= ", strJson_resD);
  // ---------get 'providerName and methodName' to redirect respectively---------
  // // let oLocation = '';
  const strJson_res = strJson_resD.response;
  const {transactionNum, formToken, merchOrderId} = strJson_res;
  // alert(transactionNum+" "+ formToken+" "+ merchOrderId);
  if (
  (providerName === 'KBZ Pay' && methodName === 'PWA')
  || (providerName === 'KBZ Direct Pay' && methodName === 'PWA')
  || (providerName === 'WAVE PAY' && methodName === 'PIN')
  || (providerName === 'AYA Pay' && methodName === 'PIN')
  || (providerName === 'Citizens' && methodName === 'PIN')
  || (providerName === 'Mytel' && methodName === 'PIN')
  || (providerName === 'MAB Bank' && methodName === 'OTP')
  ) {
    location.assign(` https://portal.dinger.asia/gateway/redirect?`+
    `transactionNo=${transactionNum}`+
    `&formToken=${formToken}`+
    `&merchantOrderId=${merchOrderId} `);
  }
  if ( (providerName === 'MPitesan' && methodName === 'PIN') ) {
    location.assign(` https://portal.dinger.asia/gateway/mpitesan?`+
    `transactionNo=${transactionNum}`+
    `&formToken=${formToken}`+
    `&merchantOrderId=${merchOrderId} `);
  }
  if ( (providerName === 'CB Pay' && methodName === 'QR') 
  || (providerName === 'AYA Pay' && methodName === 'QR') 
  || (providerName === 'KBZ Pay' && methodName === 'QR') 
  ) {
    location.assign(` https://portal.dinger.asia/gateway/cbpay?`+
    `transactionNo=${transactionNum}`+
    `&formToken=${formToken}`+
    `&merchantOrderId=${merchOrderId} `);
  }
  if (
    (providerName === 'MPU' && methodName === 'OTP')
  ) {
    location.assign(` https://portal.dinger.asia/gateway/mpu?`+
    `transactionNum=${transactionNum}`+
    `&formToken=${formToken} `);
  }
  if (
    (providerName === 'Visa')
    || (providerName === 'Master' )
    || (providerName === 'JCB' )
  ) {
    location.assign(` https://creditcard-portal.dinger.asia/?`+
    `merchantOrderId=${merchOrderId}` +
    `&transactionNum=${transactionNum}` +
    `&formToken=${formToken} `);
  }
}
// Auxillary Functions
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
  // read 'name' to get priceStr.
  const md_type = cObj_md.name.split(',')[0];
  let priceStr;
  if (md_type === "Sichat") { priceStr = "1500"; }
  else if (md_type === "KyayOh") { priceStr = "4000"; }
  else if (md_type === "KyayOh Sichat") { priceStr = "4300"; }
  // create 'obj' items.
  const cObj_itemsField = {
    ... cObj_md
    , amount  : priceStr
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
        , amount  : priceStr
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