
const submitfrm1 = document.querySelector("#frm1_checkout button");
const submitfrm2 = document.querySelector("#frm2_checkout button");

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

const cart = [];

let addingToCardCountStart = 0;

const getAddingCartBtnClickCount = () => {
    return addingToCardCountStart = 0;
} 

function sendHttpReq(method, url, dt = undefined) {
  const postD = JSON.stringify(dt);

  return fetch(url, {
    method,
    body: postD,
    headers: {
      "Content-type": "application/json",
    },
  }).then(res => {
    return res.json();
  });
}

async function post_chkout() {
  const fn_val = document.querySelector(".field1 div:nth-child(0) input").value;
  const ln_val = document.querySelector(".field1 div:nth-child(1) input").value;
  const ph_val = document.querySelector(".field2 input").value;
  const amt_val = document.querySelector(".field5 input").value;
  const typ_val = document.querySelector(".field6 input").value;
  const mtd_val = document.querySelector(".field7 input").value;
  const add_val = document.querySelector(".field3 input").value;
  const des_val = document.querySelector(".field4 input").value;

  const orderId = Math.random();
  const post_data = {
    providerName: typ_val,
    methodName: mtd_val,
    totalAmount: amt_val,
    orderId: orderId,
    customerPhone: ph_val,
    customerName: fn_val + " " + ln_val,
    Items: `[{
      'name': 
      'amount': 
      'quantity':
    }]`,
  };
  sendHttpReq("POST", `https://api.dinger.asia/`, post_data).then(res => {
    console.log(res);
  });
}

function get_authToken() {
  sendHttpReq(
    "GET",
    "https://api.dinger.asia/api/token?" +
      "projectName=form&" +
      "apiKey=r81pnlf.qBJ18LvnTvcxw2nIAhcqBu2yNP4&" +
      "merchantName=kaung myat"
  )
    .then(response => {
      if (response.code == "000") return;
      else {
        return new Promise(() => {
          throw new Error(
            "get response error code: <200 or >300 - return message: " +
              response.message
          );
        });
      }
    })
    .then()
    .catch();
}

function isVarAPureObj(obj) {
    
    return (typeof obj === 'object' &&
    !Array.isArray(obj) &&
    obj !== null);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function make_ordLst() {
  const md_val = document.querySelector("#main_dish_div select").value;
  const meat_val = document.querySelector("#choose_meat_div select").value;
  const nood_val = document.querySelector("#choose_noodle_div select").value;
  let dishCustom_val = document.querySelector("#option_customize_div select").value;
  const numberofplates_val = document.querySelector("#quantity_div input").value;
  
  let cartItem = {
    objec: {},

    get getGetter() {
      return this.objec;
    },
    set setSetter(set) {
      this.objec = set;
    }
  };

  if (md_val, meat_val, nood_val, numberofplates_val == 0) {
    // let hidInvalidWarn = document.querySelector("#hidInvalidWarn");
    // hidInvalidWarn.hidden = false;
    const InvalidFormWarn = document.createElement("div");
    document.createAttribute("hidden", "true");
    let parent = submitfrm1.parentNode;
    parent.insertBefore(InvalidFormWarn, submitfrm1);
    
    return
  }
  else {
    if (dishCustom_val == 0) dishCustom_val = null;
    const id = getRandomIntInclusive(1, 1000000000)
    const createObj = {id, md_val, meat_val, nood_val, dishCustom_val, numberofplates_val};
    cart.push(createObj);
    
    console.log(cart.entries());

    if (addingToCardCountStart < 20){
      if (cart.length == 0) cart.push(createObj);
      else {
        const index = getIdxOfTheOrderAlrdyContain(createObj, cart);
        const returnedobj = cart[index];
        console.log(returnedobj);

        if (true && returnedobj)
        {
          if (true && setnumberofplateInc(returnedobj)) {
            console.log(Object.entries(Theobj));
          }
        }
        else {
          cart.push(createObj);
        }
      }
      addingToCardCountStart++;
    }
    else {
      // let hidInvalidWarn = document.querySelector("#hidInvalidWarn");
      // hidInvalidWarn.hidden = false;
    } 
  }
}

function getIdxOfTheOrderAlrdyContain(obj, list) {
  return list.findIndex((t) =>
    t.md_val === obj.md_val && 
    t.meat_val === obj.meat_val &&
    t.nood_val === obj.nood_val &&
    t.dishCustom_val === obj.dishCustom_val
  ); 
}

// function getTheOrderAlredyContain(obj, list) {
//   if (
//     isVarAPureObj(obj)
//     &&
//     Array.isArray(list)
//     )
//   for (i = 0; i < list.length; i++) {
//     var objIsContain;                                                 // check any True in overall whole list.
//     var propCount = 0;                                                // check for 5 properties in each object.
//     var propIsContain = false;                                        // check any False in overall an object.
//     for (const [key, value] of Object.entries(list[i])) {
//       propIsContain = value === Object.values(obj)[propCount];
      
//       if (propIsContain === false) {                                  // obj is different.
//         objIsContain = false; break;
//       }
//       if (propCount == 4 && propIsContain)                            // search ended & overall is True.
//         return list[i];
//       propCount++;
//     }
//   }
//   return null;
// }

function setplateIncAndReturnObj(Theobj) {
    for (const [key, value] of Object.entries(Theobj)) {
      if (key === "numberofplates_val") {
        Theobj[key]++; return Theobj;
      }
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  onLoad();
  get_authToken();
});

submitfrm1.addEventListener("click", event => {
  event.preventDefault();

  make_ordLst();
});

submitfrm2.addEventListener("click", event => {
  event.preventDefault();

  post_chkout();
});
