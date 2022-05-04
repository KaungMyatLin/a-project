// import * as NodeRSA from '../node_modules/node-rsa/src/NodeRSA.js';
const NodeRSA = require('node-rsa');

const md_val_select = document.querySelector("#main_dish_div select");
const meat_val_select = document.querySelector("#choose_meat_div select")
const nood_val_select = document.querySelector("#choose_noodle_div select")
let dishCustom_val_select = document.querySelector("#option_customize_div select")
const numberofplates_val_input = document.querySelector("#quantity_div input")
const submitfrm1 = document.querySelector("#frm1_checkout button");
const submitfrm2 = document.querySelector("#frm2_checkout button");
let hidInvalidWarn = document.querySelector("#hidInvalidWarn");

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

let cart = [];
let addingToCardCountStart = 0;
let getToken = '';

const getAddingCartBtnClickCount = () => {
    return addingToCardCountStart = 0;
}

function sendHttpReq(method, url, payload = undefined, contType, bearerToken = undefined) {
  
  return fetch(url, {
    method,
    body: { payload },
    headers: {
      "Authorization": "Bearer " + bearerToken,
      "Content-type": contType ?? "application/json",
    },
  }).then(res => {
    return res.json();
  });
}

async function post_chkout() {
  const fn_val = document.querySelector(".fn input").value;
  const ln_val = document.querySelector(".ln input").value;
  const ph_val = document.querySelector(".field2 input").value;
  const amt_val = document.querySelector(".field5 input").value;
  const typ_val = document.querySelector(".field6 select").value;
  const mtd_val = document.querySelector(".field7 select").value;
  const add_val = document.querySelector(".field3 input").value;
  const des_val = document.querySelector(".field4 input").value;

  const orderId = getRandomIntInclusive(0,1000000000);
  const total = getTtlOfCalcPricesQty(cart);

  const postPayload_dataObj = {
    providerName: typ_val,
    methodName: mtd_val,
    // totalAmount: amt_val,
    totalAmount: total,
    orderId: orderId,
    customerPhone: ph_val,
    customerName: fn_val + " " + ln_val,
    Items: cart
  };
  console.log("postPayload_dataObj: ", JSON.stringify(cart, null, "  "));

  const pubKey = "-----BEGIN PUBLIC KEY-----\n"+
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCil81JlfqDrdXNKbKmv6pPbPPs6p/qWhtFldNBP3mjtroC2TrPEeNQXnNf23Ijvwlsf07V8eHDEd9j05A2B56OaTwsgOgaaSHjSA6tinbKmyxllAxzAWGF37+ice0ts13HYNXGsLGqYTREzF+IDKWEKcwmey4tmufxPQA/vrTEAQIDAQAB\n"+
  "-----END PUBLIC KEY-----";

  const nodersa = new NodeRSA();
  nodersa.importKey(pubKey, 'pkcs8-public');
  nodersa.setOptions({encryptionScheme: 'pkcs1'});
  // .encrypt alrdy provide Json.stringify to first arg, buffer. Second arg is encoding for output.
  const payload = nodersa.encrypt(postPayload_dataObj,'base64');
  console.log("payload: "+payload);

  getToken = '24062d70-9132-4ccf-b4c6-b8dc11c9a62e';

  sendHttpReq("POST",
  "https://api.dinger.asia/api/pay", payload, 'text/plain', getToken).then(res => {
    console.log(res);
  });
}

function get_authToken() {
  sendHttpReq(
    "GET",
    `https://api.dinger.asia/api/token?projectName=form&apiKey=r81pnlf.qBJ18LvnTvcxw2nIAhcqBu2yNP4&merchantName=kaung myat`
  )
    .then(resp => {
      console.log(resp);
      if (resp.code == "000") {
        getToken = resp.response.paymentToken;
        console.log(getToken);
      }
      else {
        return new Promise(() => {
          throw new Error(
            "get response error code: <200 or >300 - " +
            " returned code: " +
            resp.code +
            " - returned message: " +
            resp.message
          );
        });
      }
    })
    .then()
    .catch();
}

const isVarAPureObj = (obj) => {
    return (typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null);
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
  console.log(md_val, meat_val, nood_val, dishCustom_val, numberofplates_val);
  
let prod_Temp = {
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
  // let cartItem = {
  //   objec: {},

  //   get getGetter() {
  //     return this.objec;
  //   },
  //   set setSetter(set) {
  //     this.objec = set;
  //   }
  // };

  // if user doesn't select any, show hidden warning.
  if (md_val, meat_val, nood_val, numberofplates_val == 0) {
    hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> Please select Choices marked by {*}</span> </label></div>`;
    hidInvalidWarn.hidden = false;

    return;
  }
  else {
    hidInvalidWarn.hidden = true;

    // if is there any customization.
    if (dishCustom_val == 0) dishCustom_val = null;
    // if check against prod_temp.
    if (!!prod_Temp.md_val[md_val] && !!prod_Temp.meat_val[meat_val] && !!prod_Temp.nood_val[nood_val]) 
    {}
    else {
      hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> The item you selected doesn't exist.</span> </label></div>`;
      hidInvalidWarn.hidden = false;
      console.log ("not okay");
      return;
    }

    const compareObj = { md_val, meat_val, nood_val, dishCustom_val, numberofplates_val};
    
    // if check spamming more than 20 click on addingToCard.
    if (addingToCardCountStart < 20){
      // if (addingToCardCountStart >= 0 && addingToCardCountStart < 10) getToken = get_authToken();
      // if  check cart contain 0 type.
      if (cart.length == 0) cart.push(compareObj);
      else {
        const el = getElOfTheOrderAlrdyContain(compareObj, cart);

        // if there's any type that already contained, or else simply push.
        if (true && el) {
          const noofplates_Inc  = parseInt(el.numberofplates_val) + parseInt(numberofplates_val) + '';
          cart = cart.filter(t => t !== el);
          
          const replacinObj = {md_val, meat_val, nood_val, dishCustom_val, numberofplates_val: noofplates_Inc};
          cart.push(replacinObj);
        }
        else {
          cart.push(compareObj);
        }
      }
      console.log(JSON.stringify(cart, null, "  "));
      addingToCardCountStart++;
      return cart;
    }
    else {
      hidInvalidWarn.innerHTML = `<span style="color: red !important; display: inline; float: none;"> You have already submitted this form 20 times. Please refresh the page or please submit a new form.</span> </label></div>`;
      hidInvalidWarn.hidden = false;
    }
  }
}

const getTtlOfCalcPricesQty = (list) => {
  let price;

  return list.reduce( (sum, cur) => {
      const {md_val, numberofplates_val} = cur;
      
      if (md_val === "Sichat") { price = 1500; }
      else if (md_val === "KyayOh") { price = 4000; }
      else if (md_val === "KyayOh Sichat") { price = 4300; }

      return price * numberofplates_val + sum;
  }, 0)
}

const getElOfTheOrderAlrdyContain = (obj, list) => {
  return list.find((t) =>
    t.md_val === obj.md_val && 
    t.meat_val === obj.meat_val &&
    t.nood_val === obj.nood_val &&
    t.dishCustom_val === obj.dishCustom_val
  ); 
}

document.addEventListener("DOMContentLoaded", () => {
  onLoad();
  // get_authToken();
});

submitfrm1.addEventListener("click", event => {
  event.preventDefault();
  create_ordLst();
});

submitfrm2.addEventListener("click", event => {
  event.preventDefault();

  post_chkout();
});
