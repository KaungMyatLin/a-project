const NodeRSA = require('node-rsa');            // Commonjs_Module
import constants from './constants/apiIntePcs_Const';   // ES_Module

// DOMObj let and const variables
const md_val_select = document.querySelector("#main_dish_div select");
const meat_val_select = document.querySelector("#choose_meat_div select")
const nood_val_select = document.querySelector("#choose_noodle_div select")
let dishCustom_val_select = document.querySelector("#option_customize_div select")
const numberofplates_val_input = document.querySelector("#quantity_div input")
const alertList = document.querySelector("#frm1_checkout button");
const addtoListfrm = document.querySelector("#frm1_done button");
const submitfrm2 = document.querySelector("#frm2_checkout button");
let hidInvalidWarn = document.querySelector("#hidInvalidWarn");
const fn_inp = document.querySelector(".fn input");
const ln_inp = document.querySelector(".ln input");
const ph_inp = document.querySelector(".field2 input");
const typ_sel = document.querySelector(".field6 select");
const mtd_sel = document.querySelector(".field7 select");
const add_inp = document.querySelector(".field3 input");
const des_inp = document.querySelector(".field4 input");

// functional Events
function onLoad() {
  const mainDish_ddm = document.querySelector("#main_dish");

  mainDish_ddm.addEventListener("change", e => {
    const dishcustomization = document.querySelector("#option_customize_div");
    if ( e.target.options[e.target.options.selectedIndex].text == "--Choose Menu--" 
    ) {
      dishcustomization.hidden = true;
      return;
    } else if ( e.target.options[e.target.options.selectedIndex].text == "Sichat"
    ) {
      dishcustomization.hidden = true;
    } else {
      dishcustomization.hidden = false;
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  onLoad();
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

// global let variables
let cart = [];
let payload_unencrypt = {};
let addingToCardCountStart = 0;
let getToken = '';

// functions
const sendHttpReq = (method, url, {payload = undefined, contType = "application/json", bearerToken = undefined}) => {
  const Authorization = bearerToken ? undefined :"Bearer " + bearerToken;
  return fetch(url, {
    method,
    body: payload,
    headers: {
      "Authorization": Authorization,
      "Content-type": contType,
    },
  }).then(res => {
    return res.json();
  });
}
async function post_chkout() {
  const fn_val = fn_inp.value;
  const ln_val = ln_inp.value;
  const ph_val = ph_inp.value;
  const typ_val = typ_sel.value;
  const mtd_val = mtd_sel.value;
  const add_val = add_inp.value;
  const des_val = des_inp.value;

  // if user doesn't select any, show hidden warning.
  if (typ_sel, mtd_sel == 0 && fn_val, ln_val, ph_val == '') {
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> Please select Choices marked by {*}</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    return;
  }

  // get 'const' orderId & calculatedTotal.
  const orderId = getRandomIntInclusive(0,1000000000);
  const total = getTtlOfCalcPricesQty(cart);
  // create 'obj' postPayload.
  const cObj_postPayload = {
    providerName: typ_val,
    methodName: mtd_val,
    totalAmount: total,
    orderId: orderId + '',
    customerPhone: ph_val,
    customerName: fn_val + ' ' + ln_val,
    Items: cart
  };
  payload_unencrypt = cObj_postPayload;

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
  getToken = constants.getToken ?? get_authToken() ?? null;
  // appending 'base64' encoding as form field in body.
  const formData = new FormData();
  formData.append('payload', 'payload='+payload);
  sendHttpReq("POST"
    ,constants.payApi, {payload: formData, contType: constants.payHttpPostMIME, bearerToken: getToken})
    .then(res => { console.log(res); });
  // get 'providerName and methodName' to redirect respectively.
  let oLocation = '';
  const {providerName, methodName} = cObj_postPayload;
  // // if (providerName === 'AYA')
  // // location.assign("http://www.mozilla.org");
  console.log(JSON.stringify(cObj_postPayload, null, " "));
}
const get_authToken = () => {
  sendHttpReq("GET"
    ,constants.getApi, {contType:'text/plain'}  )
  .then(resp => {
        console.log(resp);
        if (resp.status <= 200 && resp.status > 300) return new Promise(() => {
                throw new Error(
                  "Something went wrong between you sent and server receiving"
                )});
        return resp;
  })
  .then(resp => {
    console.log(resp);
        if(resp.code == "000") {console.log(getToken); return resp.response.paymentToken;} //guard clause

        return new Promise(() => {
          throw new Error(
            " server responsed with backend error code: " +
            resp.code +
            " - responsed message: " +
            resp.message
            );
          })
  })
  .catch(error => {
        alert("Something went wrong during GET response\n" + error);
        console.log(error);
  });
}
const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
const create_ordLst = () => {
  const md_val = md_val_select.value;
  const meat_val = meat_val_select.value;
  const nood_val = nood_val_select.value;
  let dishCustom_val = dishCustom_val_select.value;
  const numberofplates_val = numberofplates_val_input.value;

  let rTmpl_Items = {
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

  // if user doesn't select any, show hidden warning.
  if (md_val, meat_val, nood_val, numberofplates_val == 0) {
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> Please select Choices marked by {*}</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    return;
  }
  hidInvalidWarn.hidden = true;
  // if is there any customization.
  if (dishCustom_val == 0) dishCustom_val = null;
  // if 'check' against prod_temp.
  if (!!rTmpl_Items.md_val[md_val] && !!rTmpl_Items.meat_val[meat_val] && !!rTmpl_Items.nood_val[nood_val]) 
  {}
  else {
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> The item you selected doesn't exist.</span> </label></div>`;
    hidInvalidWarn.hidden = false;
    console.log ("not okay");
    return;
  }
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