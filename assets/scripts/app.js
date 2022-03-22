const mainDish_ddm = document.querySelector("#main-dish");
const submitfrm = document.querySelector("#frm_checkout button");

function onLoad() {
  mainDish_ddm.addEventListener("change", e => {
    console.dir(e.target.options[e.target.options.selectedIndex].text);

    const dishcustomization = document.querySelector("#option-customize");
    console.dir(dishcustomization);

    if (
      e.target.options[e.target.options.selectedIndex].text == "--Choose Menu--"
    ) {
      dishcustomization.hidden = true;
      return;
    } else if (
      e.target.options[e.target.options.selectedIndex].text == "Sichat"
    ) {
      dishcustomization.hidden = true;
    } else {
      dishcustomization.hidden = false;
    }
  });
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
  let fn_val = document.querySelector(".field1 div:nth-child(0) input").value;
  let ln_val = document.querySelector(".field1 div:nth-child(1) input").value;
  let ph_val = document.querySelector(".field2 input").value;
  let amt_val = document.querySelector(".field5 input").value;
  let typ_val = document.querySelector(".field6 input").value;
  let mtd_val = document.querySelector(".field7 input").value;
  let add_val = document.querySelector(".field3 input").value;
  let des_val = document.querySelector(".field4 input").value;

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
    `https://api.dinger.asia/api/token?
    projectName=Test&
    apiKey=21r65r4&
    merchantName=kaungmyat`
  );
}

document.addEventListener("DOMContentLoaded", () => {
  onLoad();
});

submitfrm.addEventListener("click", event => {
  event.preventDefault();

  post_chkout();
});
