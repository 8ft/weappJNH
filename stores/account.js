const extendObservable = require('../libs/mobx').extendObservable;
const account = function () {
  extendObservable(this, {
    state: 0 //账号状态：0-未登录|1-已登录|2-过期
  });

  this.login = function () {
    this.state=1;
  }

  this.logout = function () {
    this.state = 0;
  }

  this.expire = function () {
    this.state = 2;
  }
}

module.exports = new account