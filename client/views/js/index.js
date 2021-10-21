const {request} = require("express");

function login_btn_click() {
  location.pathname = "login";
}

function register_btn_click() {
  location.pathname = "register";
}

function title_onclick() {
  location.href = '/';
}

function upload_onclick() {
  location.href = 'upload';
}

function sign_out_onclick() {
  request_session.destroy(function (error) {
    if (error) {
      console.log(error);
    } else {
      location.href = '/';
    }
  });
}
